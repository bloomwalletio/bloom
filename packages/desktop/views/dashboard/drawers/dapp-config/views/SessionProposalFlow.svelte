<script lang="ts">
    import { connectToDapp } from '@auxiliary/wallet-connect/actions'
    import { ALL_SUPPORTED_METHODS, SUPPORTED_EVENTS } from '@auxiliary/wallet-connect/constants'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'
    import { getPersistedDappNamespacesForDapp } from '@auxiliary/wallet-connect/stores'
    import { ISupportedNamespace, SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { getCaip10AddressForAccount } from '@auxiliary/wallet-connect/utils'
    import { IAccountState } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { getEvmNetworks } from '@core/network'
    import { activeAccounts } from '@core/profile/stores'
    import { Router } from '@core/router'
    import { Web3WalletTypes } from '@walletconnect/web3wallet'
    import { SessionProposalFlowShared } from '.'

    export let drawerRouter: Router<unknown>
    export let sessionProposal: Web3WalletTypes.SessionProposal

    $: verifiedState = sessionProposal?.verifyContext.verified.isScam
        ? DappVerification.Scam
        : (sessionProposal.verifyContext.verified.validation as DappVerification)

    const requiredNamespaces = sessionProposal.params.requiredNamespaces
    const optionalNamespaces = sessionProposal.params.optionalNamespaces

    const supportedNamespaces = initSupportedNamespaces()
    function initSupportedNamespaces(): SupportedNamespaces {
        if (!sessionProposal) {
            return {}
        }

        const persistedNamespaces = sessionProposal
            ? getPersistedDappNamespacesForDapp(sessionProposal.params.proposer.metadata.url)
            : undefined

        if (persistedNamespaces) {
            return persistedNamespaces.supported
        }

        const { requiredNamespaces, optionalNamespaces } = sessionProposal.params

        const allChainids = [...Object.values(requiredNamespaces), ...Object.values(optionalNamespaces)]
            .flatMap(({ chains }) => chains)
            .filter(Boolean)

        const namespace: Record<string, ISupportedNamespace> = {}
        for (const network of getEvmNetworks()) {
            if (!allChainids.includes(network.id)) {
                continue
            }

            if (!namespace[network.namespace]) {
                const accounts = $activeAccounts
                    .map((account) => getCaip10AddressForAccount(account, network.id) as string)
                    .filter(Boolean)

                namespace[network.namespace] = {
                    chains: [],
                    methods: ALL_SUPPORTED_METHODS,
                    events: SUPPORTED_EVENTS,
                    accounts,
                }
            }

            namespace[network.namespace].chains.push(network.id)
        }
        return namespace
    }

    async function onConfirm(supportedNamespaces: SupportedNamespaces): Promise<void> {
        await connectToDapp(supportedNamespaces, sessionProposal, $selectedAccount as IAccountState)
    }
</script>

<SessionProposalFlowShared
    {drawerRouter}
    dappMetadata={sessionProposal.params.proposer.metadata}
    {verifiedState}
    expiryTimestamp={sessionProposal.params.expiryTimestamp}
    {requiredNamespaces}
    {optionalNamespaces}
    {supportedNamespaces}
    {onConfirm}
/>

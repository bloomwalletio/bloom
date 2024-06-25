<script lang="ts">
    import { Router } from '@core/router'
    import { buildDefaultNamespaces } from '@auxiliary/wallet-connect/utils'
    import { getAddressFromAccountForNetwork } from '@core/account'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'
    import { Web3WalletTypes } from '@walletconnect/web3wallet'
    import { getPersistedDappNamespacesForDapp } from '@auxiliary/wallet-connect/stores'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { LedgerAppName } from '@core/ledger'
    import { approveSessionAuthenticate } from '@auxiliary/wallet-connect/actions/approveSessionAuthenticate'
    import { ALL_EVM_METHODS, SUPPORTED_EVENTS } from '@auxiliary/wallet-connect/constants'
    import SessionProposalFlowShared from './SessionProposalFlowShared.svelte'
    import { SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { EvmNetworkId } from '@core/network'
    import { activeAccounts } from '@core/profile/stores'

    export let drawerRouter: Router<unknown>
    export let sessionProposal: Web3WalletTypes.SessionAuthenticate

    const verifiedState = DappVerification.Unknown

    const dappMetadata = sessionProposal.params.requester.metadata

    const requiredNamespaces = {}
    const optionalNamespaces = {
        eip155: {
            chains: sessionProposal.params.authPayload.chains,
            methods: ALL_EVM_METHODS,
            events: SUPPORTED_EVENTS,
        },
    }

    const supportedNamespaces = initSupportedNamespaces()
    function initSupportedNamespaces(): SupportedNamespaces {
        if (!sessionProposal) {
            return {}
        }

        const persistedNamespaces = getPersistedDappNamespacesForDapp(dappMetadata.url)
        if (persistedNamespaces) {
            return persistedNamespaces.supported
        }

        const defaultNamespaces = buildDefaultNamespaces()

        for (const namespace of Object.keys(defaultNamespaces)) {
            const supportedMethodsByDapp = ALL_EVM_METHODS
            defaultNamespaces[namespace].methods = defaultNamespaces[namespace].methods.filter((method) =>
                supportedMethodsByDapp.includes(method)
            )

            const supportedNetworksByDapp = sessionProposal.params.authPayload.chains
            defaultNamespaces[namespace].chains = defaultNamespaces[namespace].chains.filter((chain) =>
                supportedNetworksByDapp.includes(chain)
            )
        }

        return defaultNamespaces
    }
    async function onConfirm(supportedNamespaces: SupportedNamespaces): Promise<boolean> {
        try {
            await checkActiveProfileAuth(LedgerAppName.Ethereum)
        } catch {
            return false
        }

        const checkedAccounts = $activeAccounts.filter((account) =>
            supportedNamespaces.eip155.accounts.some((caipAddress) => {
                const [namespace, chainId, address] = caipAddress.split(':')
                return getAddressFromAccountForNetwork(account, `${namespace}:${chainId}` as EvmNetworkId) === address
            })
        )
        const checkedNetworks = supportedNamespaces.eip155.chains
        const checkedMethods = supportedNamespaces.eip155.methods

        await approveSessionAuthenticate(sessionProposal, {
            accounts: checkedAccounts,
            chains: checkedNetworks,
            methods: checkedMethods,
        })

        return true
    }
</script>

<SessionProposalFlowShared
    {drawerRouter}
    dappMetadata={sessionProposal.params.requester.metadata}
    {verifiedState}
    expiryTimestamp={sessionProposal.params.expiryTimestamp}
    {requiredNamespaces}
    {optionalNamespaces}
    {supportedNamespaces}
    confirmButtonLocaleKey="general.signUp"
    {onConfirm}
/>

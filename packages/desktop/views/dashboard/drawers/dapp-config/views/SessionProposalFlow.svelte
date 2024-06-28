<script lang="ts">
    import { connectToDapp } from '@auxiliary/wallet-connect/actions'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'
    import { getPersistedDappNamespacesForDapp } from '@auxiliary/wallet-connect/stores'
    import { SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { buildDefaultNamespaces } from '@auxiliary/wallet-connect/utils'
    import { IAccountState } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { Router } from '@core/router'
    import { Web3WalletTypes } from '@walletconnect/web3wallet'
    import { SessionProposalFlowShared } from '.'
    import { Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let drawerRouter: Router<unknown>
    export let sessionProposal: Web3WalletTypes.SessionProposal

    $: verifiedState = sessionProposal?.verifyContext.verified.isScam
        ? DappVerification.Scam
        : (sessionProposal.verifyContext.verified.validation as DappVerification)

    const dappMetadata = sessionProposal.params.proposer.metadata
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

        const defaultNamespaces = buildDefaultNamespaces()

        for (const namespace of Object.keys(defaultNamespaces)) {
            const supportedMethodsByDapp = [
                ...(requiredNamespaces[namespace]?.methods || []),
                ...(optionalNamespaces[namespace]?.methods || []),
            ]
            defaultNamespaces[namespace].methods = defaultNamespaces[namespace].methods.filter((method) =>
                supportedMethodsByDapp.includes(method)
            )

            const supportedNetworksByDapp = [
                ...(requiredNamespaces[namespace]?.chains || []),
                ...(optionalNamespaces[namespace]?.chains || []),
            ]
            defaultNamespaces[namespace].chains = defaultNamespaces[namespace].chains.filter((chain) =>
                supportedNetworksByDapp.includes(chain)
            )
        }

        return defaultNamespaces
    }

    async function onConfirm(supportedNamespaces: SupportedNamespaces): Promise<boolean> {
        await connectToDapp(supportedNamespaces, sessionProposal, $selectedAccount as IAccountState)
        return true
    }
</script>

<SessionProposalFlowShared
    {drawerRouter}
    {dappMetadata}
    {verifiedState}
    expiryTimestamp={sessionProposal.params.expiryTimestamp}
    {requiredNamespaces}
    {optionalNamespaces}
    {supportedNamespaces}
    confirmButtonLocaleKey="actions.confirm"
    {onConfirm}
>
    <Table
        items={[
            {
                key: localize('general.description'),
                value: dappMetadata.description || undefined,
            },
        ]}
        orientation="vertical"
    />
</SessionProposalFlowShared>

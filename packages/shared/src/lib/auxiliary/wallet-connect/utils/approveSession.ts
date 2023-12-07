import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { buildApprovedNamespaces } from '@walletconnect/utils'
import { getWalletClient, setConnectedDapps } from '../stores'
import { handleError } from '@core/error/handlers'

export async function approveSession(
    sessionProposal: Web3WalletTypes.SessionProposal,
    supportedNamespaces: Record<
        string,
        {
            chains: string[]
            methods: string[]
            events: string[]
            accounts: string[]
        }
    >
): Promise<void> {
    const { id, params } = sessionProposal

    const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces,
    })

    try {
        await getWalletClient()?.approveSession({ id, namespaces: approvedNamespaces })
        setConnectedDapps()
    } catch (err) {
        handleError(err)
    }
}

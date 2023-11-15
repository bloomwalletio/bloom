import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { SUPPORTED_EVENTS, SUPPORTED_METHODS } from '../constants'
import { buildApprovedNamespaces } from '@walletconnect/utils'
import { getWalletClient, setConnectedDapps } from '../stores'
import { getAllNetworkIds } from '@core/network'

export async function approveSession(
    sessionProposal: Web3WalletTypes.SessionProposal,
    addresses: string[]
): Promise<void> {
    const { id, params } = sessionProposal

    const chains = getAllNetworkIds()
    const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces: {
            eip155: {
                chains,
                methods: SUPPORTED_METHODS,
                events: SUPPORTED_EVENTS,
                accounts: addresses,
            },
        },
    })

    await getWalletClient()?.approveSession({ id, namespaces: approvedNamespaces })
    setConnectedDapps()
}

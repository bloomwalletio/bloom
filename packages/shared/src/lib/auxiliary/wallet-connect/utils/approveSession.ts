import { buildApprovedNamespaces } from '@walletconnect/utils'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { SUPPORTED_EVENTS, SUPPORTED_METHODS } from '../constants'
import { getWalletClient, setConnectedDapps } from '../stores'

export async function approveSession(
    sessionProposal: Web3WalletTypes.SessionProposal,
    addresses: string[]
): Promise<void> {
    const { id, params } = sessionProposal

    const chains = ['eip155:1', 'eip155:5']

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

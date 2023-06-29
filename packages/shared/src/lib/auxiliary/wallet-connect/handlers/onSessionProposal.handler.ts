import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { SUPPORTED_EVENTS, SUPPORTED_METHODS } from '../constants'
import { buildApprovedNamespaces } from '@walletconnect/utils'
import { getAllEvmAddresses } from '../utils'
import { getWalletClient } from '../stores'

export function onSessionProposal(sessionProposal: Web3WalletTypes.SessionProposal): void {
    const { id, params } = sessionProposal

    const chains = ['eip155:1']

    const accounts = getAllEvmAddresses(chains)
    const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces: {
            eip155: {
                chains,
                methods: SUPPORTED_METHODS,
                events: SUPPORTED_EVENTS,
                accounts,
            },
        },
    })

    void getWalletClient()?.approveSession({ id, namespaces: approvedNamespaces })
}

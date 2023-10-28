import { SUPPORTED_EVENTS, SUPPORTED_METHODS } from '../constants'
import { getWalletClient } from '../stores'
import { getAllEvmAddresses } from './getAllEvmAddresses'

export async function updateActiveSessionsToActiveProfile(): Promise<void> {
    const chains = ['eip155:1', 'eip155:5']
    const addresses: string[] = getAllEvmAddresses(chains)

    const updatedNamespaces = {
        eip155: {
            chains,
            methods: SUPPORTED_METHODS,
            events: SUPPORTED_EVENTS,
            accounts: addresses,
        },
    }

    const activeSessions = getWalletClient()?.getActiveSessions() ?? {}
    for (const sessionTopic of Object.keys(activeSessions)) {
        await getWalletClient()?.updateSession({ topic: sessionTopic, namespaces: updatedNamespaces })
    }
}

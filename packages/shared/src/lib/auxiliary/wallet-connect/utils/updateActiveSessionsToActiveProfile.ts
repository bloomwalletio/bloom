import { getAllNetworkIds } from '@core/network'
import { SUPPORTED_EVENTS } from '../constants'
import { getWalletClient } from '../stores'
import { getAllEvmAddresses } from './getAllEvmAddresses'

export async function updateActiveSessionsToActiveProfile(): Promise<void> {
    const chains = getAllNetworkIds()
    const addresses = getAllEvmAddresses(chains)

    const updatedNamespaces = {
        eip155: {
            chains,
            methods: [], // TODO: add here all methods the user persisted for the specific dApp
            events: SUPPORTED_EVENTS,
            accounts: addresses,
        },
    }

    const activeSessions = getWalletClient()?.getActiveSessions() ?? {}
    for (const sessionTopic of Object.keys(activeSessions)) {
        await getWalletClient()?.updateSession({ topic: sessionTopic, namespaces: updatedNamespaces })
    }
}

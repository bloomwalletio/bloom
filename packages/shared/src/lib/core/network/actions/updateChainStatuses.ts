import { NetworkHealth } from '../enums'
import { IChainStatus } from '../interfaces'
import { chainStatuses, getEvmNetworks } from '../stores'

export async function updateChainStatuses(): Promise<void> {
    const networks = getEvmNetworks()
    /**
     * CAUTION: It may become problematic when a profile contains
     * many chains such that the poll interval is not long enough
     * to complete all the queries for every evmNetwork's status.
     */
    await Promise.all(
        networks.map(async (evmNetwork) => {
            let networkStatus: IChainStatus
            try {
                await evmNetwork.getLatestBlock()
                networkStatus = { health: NetworkHealth.Operational }
            } catch (err) {
                networkStatus = { health: NetworkHealth.Disconnected }
            }

            chainStatuses.update((_chainStatuses) => ({ ..._chainStatuses, [evmNetwork.id]: networkStatus }))
        })
    )
}

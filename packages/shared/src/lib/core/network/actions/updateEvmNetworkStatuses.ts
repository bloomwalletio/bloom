import { NetworkHealth } from '../enums'
import { IEvmNetworkStatus } from '../interfaces'
import { evmNetworkStatuses, getEvmNetworks } from '../stores'

export async function updateEvmNetworkStatuses(): Promise<void> {
    const networks = getEvmNetworks()
    /**
     * CAUTION: It may become problematic when a profile contains
     * many chains such that the poll interval is not long enough
     * to complete all the queries for every evmNetwork's status.
     */
    await Promise.all(
        networks.map(async (evmNetwork) => {
            let networkStatus: IEvmNetworkStatus
            try {
                await evmNetwork.getLatestBlock()
                networkStatus = { health: NetworkHealth.Operational }
            } catch (err) {
                networkStatus = { health: NetworkHealth.Disconnected }
            }

            evmNetworkStatuses.update((_evmNetworkStatuses) => ({
                ..._evmNetworkStatuses,
                [evmNetwork.id]: networkStatus,
            }))
        })
    )
}

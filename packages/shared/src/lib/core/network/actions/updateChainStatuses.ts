import { NetworkHealth } from '../enums'
import { IChainStatus } from '../interfaces'
import { chainStatuses, getEvmNetworks } from '../stores'

export async function updateChainStatuses(): Promise<void> {
    const chains = getEvmNetworks()
    /**
     * CAUTION: It may become problematic when a profile contains
     * many chains such that the poll interval is not long enough
     * to complete all the queries for every evmNetwork's status.
     */
    await Promise.all(
        chains.map(async (evmNetwork) => {
            let chainStatus: IChainStatus
            try {
                await evmNetwork.getLatestBlock()
                chainStatus = { health: NetworkHealth.Operational }
            } catch (err) {
                chainStatus = { health: NetworkHealth.Disconnected }
            }

            chainStatuses.update((_chainStatuses) => ({ ..._chainStatuses, [evmNetwork.id]: chainStatus }))
        })
    )
}

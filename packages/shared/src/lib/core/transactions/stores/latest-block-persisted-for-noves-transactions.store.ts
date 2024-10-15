import { NetworkId } from '@core/network'
import { get, writable } from 'svelte/store'

type LatestBlockPersistedForAccountNetwork = {
    [profileId: string]: {
        [accountId: number]: {
            [networkId in NetworkId]?: {
                latestBlock?: number
            }
        }
    }
}

export const latestBlockPersistedForNovesTransactions = writable<LatestBlockPersistedForAccountNetwork>({})

export function getLatestBlockForPersistedNovesTransactionsForAccountNetwork(
    profileId: string,
    accountId: number,
    networkId: NetworkId
): number | undefined {
    return get(latestBlockPersistedForNovesTransactions)[profileId]?.[accountId]?.[networkId]?.latestBlock
}

export function updateLatestBlockForPersistedNovesTransactionsForAccountNetwork(
    profileId: string,
    accountId: number,
    networkId: NetworkId,
    latestBlock: number
): void {
    latestBlockPersistedForNovesTransactions.update((state) => {
        if (!state[profileId]) {
            state[profileId] = {}
        }

        if (!state[profileId][accountId]) {
            state[profileId][accountId] = {}
        }

        if (!state[profileId][accountId][networkId]) {
            state[profileId][accountId][networkId] = {}
        }

        const obj = state[profileId][accountId][networkId] ?? {}

        obj.latestBlock = latestBlock

        state[profileId][accountId][networkId] = obj

        return state
    })
}

import { NetworkId } from '@core/network/types'
import { persistent } from '@core/utils/store'
import { PersistedEvmTransaction } from '../types'

type PersistedEvmTransactions = {
    [profileId: string]: {
        [accountId: string]: {
            [networkId in NetworkId]?: PersistedEvmTransaction[]
        }
    }
}

export const persistedEvmTransactions = persistent<PersistedEvmTransactions>('evmTransactions', {})

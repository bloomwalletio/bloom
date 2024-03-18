import { NetworkId } from '@core/network/types'
import { LocalEvmTransaction } from '@core/transactions'
import { persistent } from '@core/utils/store'

type PersistedEvmTransactions = {
    [profileId: string]: {
        [accountId: string]: {
            [networkId in NetworkId]?: LocalEvmTransaction[]
        }
    }
}

export const persistedEvmTransactions = persistent<PersistedEvmTransactions>('evmTransactions', {})

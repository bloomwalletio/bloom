import { IAccountState } from '@core/account/interfaces'
import { IChain } from '@core/network'
import { LocalEvmTransaction } from '@core/transactions'
import { EvmActivity } from '../../types'
import { generateActivityFromPersistedTransaction } from './generateActivityFromPersistedTransaction'

export async function generateActivityFromEvmTransaction(
    transaction: LocalEvmTransaction,
    chain: IChain,
    account: IAccountState
): Promise<EvmActivity | undefined> {
    return generateActivityFromPersistedTransaction({ local: transaction }, chain, account)
}

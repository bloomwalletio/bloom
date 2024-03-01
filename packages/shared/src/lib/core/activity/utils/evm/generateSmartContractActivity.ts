import { BASE_TOKEN_ID } from '@core/token'
import { StardustActivityType } from '../../enums'
import { PersistedEvmTransaction, StardustSmartContractActivity } from '../../types'
import { IChain } from '@core/network'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'
import { IAccountState } from '@core/account/interfaces'
import { Converter } from '@core/utils/convert'
import { getMethodNameForEvmTransaction } from '@core/layer-2/utils'

export async function generateSmartContractActivity(
    transaction: PersistedEvmTransaction,
    chain: IChain,
    account: IAccountState
): Promise<StardustSmartContractActivity> {
    const baseEvmActivity = await generateBaseEvmActivity(transaction, chain, transaction.to?.toString(), account)

    const baseTokenTransfer = {
        tokenId: BASE_TOKEN_ID,
        rawAmount: Converter.bigIntLikeToBigInt(transaction.value),
    }
    const methodName = await getMethodNameForEvmTransaction(transaction)

    return {
        ...baseEvmActivity,
        type: StardustActivityType.SmartContract,
        methodName,
        data: String(transaction.data ?? ''),

        // asset information
        baseTokenTransfer,
    }
}

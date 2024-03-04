import { IAccountState } from '@core/account/interfaces'
import { getMethodNameForEvmTransaction } from '@core/layer-2/utils'
import { IChain } from '@core/network'
import { BASE_TOKEN_ID } from '@core/token'
import { LocalEvmTransaction } from '@core/transactions'
import { Converter } from '@core/utils/convert'
import { StardustActivityType } from '../../enums'
import { StardustSmartContractActivity } from '../../types'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'

export async function generateSmartContractActivity(
    transaction: LocalEvmTransaction,
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

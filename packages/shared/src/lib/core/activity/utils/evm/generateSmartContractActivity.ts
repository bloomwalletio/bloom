import { BASE_TOKEN_ID } from '@core/token'
import { ActivityType } from '../../enums'
import { PersistedEvmTransaction, SmartContractActivity } from '../../types'
import { IChain } from '@core/network'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'
import { IAccountState } from '@core/account/interfaces'
import { Converter } from '@core/utils/convert'

export async function generateSmartContractActivity(
    transaction: PersistedEvmTransaction,
    chain: IChain,
    account: IAccountState
): Promise<SmartContractActivity> {
    const baseEvmActivity = await generateBaseEvmActivity(transaction, chain, transaction.to?.toString(), account)

    const baseTokenTransfer = {
        tokenId: BASE_TOKEN_ID,
        rawAmount: Converter.bigIntLikeToBigInt(transaction.value),
    }

    return {
        ...baseEvmActivity,
        type: ActivityType.SmartContract,
        methodName: String(transaction.data)?.slice(0, 10),
        data: String(transaction.data),

        // asset information
        baseTokenTransfer,
    }
}

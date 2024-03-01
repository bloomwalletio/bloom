import { BASE_TOKEN_ID } from '@core/token'
import { ActivityType } from '../../enums'
import { StardustNftActivity, PersistedEvmTransaction } from '../../types'
import { IChain } from '@core/network'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'
import { IAccountState } from '@core/account/interfaces'

export async function generateNftActivity(
    transaction: PersistedEvmTransaction,
    chain: IChain,
    nftId: string,
    baseTokenAmount: bigint | undefined,
    recipientAddress: string | undefined,
    account: IAccountState
): Promise<StardustNftActivity> {
    const baseEvmActivity = await generateBaseEvmActivity(transaction, chain, recipientAddress, account)

    const baseTokenTransfer = {
        tokenId: BASE_TOKEN_ID,
        rawAmount: baseTokenAmount ?? BigInt(0),
    }
    return {
        ...baseEvmActivity,
        type: ActivityType.Nft,

        // asset information
        baseTokenTransfer,
        nftId,
    }
}

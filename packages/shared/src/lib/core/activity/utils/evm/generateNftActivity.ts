import { IAccountState } from '@core/account/interfaces'
import { IChain } from '@core/network'
import { BASE_TOKEN_ID } from '@core/token'
import { LocalEvmTransaction } from '@core/transactions'
import { StardustActivityType } from '../../enums'
import { StardustNftActivity } from '../../types'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'

export async function generateNftActivity(
    transaction: LocalEvmTransaction,
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
        type: StardustActivityType.Nft,

        // asset information
        baseTokenTransfer,
        nftId,
    }
}

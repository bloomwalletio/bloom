import { NetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token'
import { ActivityType } from '../../enums'
import { NftActivity, PersistedEvmTransaction } from '../../types'
import { IChain } from '@core/network'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'

export async function generateNftActivity(
    transaction: PersistedEvmTransaction,
    networkId: NetworkId,
    chain: IChain,
    nftId: string,
    recipientAddress: string | undefined
): Promise<NftActivity> {
    const baseEvmActivity = await generateBaseEvmActivity(transaction, networkId, chain, recipientAddress)

    const baseTokenTransfer = {
        tokenId: BASE_TOKEN_ID,
        rawAmount: '0',
    }
    return {
        ...baseEvmActivity,
        type: ActivityType.Nft,

        // asset information
        baseTokenTransfer,
        nftId,
    }
}

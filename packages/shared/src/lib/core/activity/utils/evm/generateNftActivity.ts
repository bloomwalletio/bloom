import { NetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token'
import { ActivityType } from '../../enums'
import { NftActivity, PersistedEvmTransaction } from '../../types'
import { IChain } from '@core/network'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'
import { IAccountState } from '@core/account/interfaces'

export async function generateNftActivity(
    transaction: PersistedEvmTransaction,
    networkId: NetworkId,
    chain: IChain,
    nftId: string,
    recipientAddress: string | undefined,
    account: IAccountState
): Promise<NftActivity> {
    const baseEvmActivity = await generateBaseEvmActivity(transaction, networkId, chain, recipientAddress, account)

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

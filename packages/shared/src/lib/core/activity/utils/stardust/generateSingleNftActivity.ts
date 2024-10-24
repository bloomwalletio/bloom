import { IAccountState } from '@core/account'
import type { NftOutput } from '@iota/sdk/out/types'
import { ActivityAction, StardustActivityType } from '../../enums'
import { StardustNftActivity } from '../../types'
import { StardustNetworkId } from '@core/network/types'
import { IActivityGenerationParameters } from '../../types/activity-generation-parameters.interface'
import { generateSingleBasicActivity } from './generateSingleBasicActivity'
import { getNftId } from '../outputs'
import { BASE_TOKEN_ID } from '@core/token/constants'

export async function generateSingleNftActivity(
    account: IAccountState,
    networkId: StardustNetworkId,
    generationParameters: IActivityGenerationParameters,
    nftIdFromInput?: string
): Promise<StardustNftActivity> {
    const baseActivity = await generateSingleBasicActivity(account, networkId, generationParameters)
    baseActivity.tokenTransfer = undefined

    const { output, outputId } = generationParameters.wrappedOutput
    const nftId = nftIdFromInput ? nftIdFromInput : getNftId((output as NftOutput).nftId, outputId)

    if (generationParameters.action === ActivityAction.Mint) {
        baseActivity.storageDeposit = baseActivity.baseTokenTransfer?.rawAmount
            ? baseActivity.baseTokenTransfer?.rawAmount
            : undefined
        baseActivity.baseTokenTransfer = {
            tokenId: BASE_TOKEN_ID,
            rawAmount: BigInt(0),
        }
    }

    return {
        ...baseActivity,
        type: StardustActivityType.Nft,
        nftId,
    }
}

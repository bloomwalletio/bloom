import { IAccountState } from '@core/account'
import type { NftOutput } from '@iota/sdk/out/types'
import { ActivityAction, ActivityType } from '../enums'
import { NftActivity } from '../types'
import { NetworkId } from '@core/network/types'
import { IActivityGenerationParameters } from '../types/activity-generation-parameters.interface'
import { generateSingleBasicActivity } from './generateSingleBasicActivity'
import { getNftId } from './outputs'
import { BASE_TOKEN_ID } from '@core/token/constants'

export async function generateSingleNftActivity(
    account: IAccountState,
    networkId: NetworkId,
    generationParameters: IActivityGenerationParameters,
    nftIdFromInput?: string
): Promise<NftActivity> {
    const baseActivity = await generateSingleBasicActivity(account, networkId, generationParameters)
    baseActivity.tokenTransfer = undefined

    const { output, outputId } = generationParameters.wrappedOutput
    const nftId = nftIdFromInput ? nftIdFromInput : getNftId((output as NftOutput).nftId, outputId)

    if (generationParameters.action === ActivityAction.Mint) {
        baseActivity.storageDeposit = baseActivity.baseTokenTransfer?.rawAmount
            ? Number(baseActivity.baseTokenTransfer?.rawAmount)
            : undefined
        baseActivity.baseTokenTransfer = {
            tokenId: BASE_TOKEN_ID,
            rawAmount: '0',
        }
    }

    return {
        ...baseActivity,
        type: ActivityType.Nft,
        nftId,
    }
}

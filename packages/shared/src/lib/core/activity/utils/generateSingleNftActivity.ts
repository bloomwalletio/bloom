import { IAccountState } from '@core/account'
import { NetworkId } from '@core/network/types'
import type { INftOutput } from '@iota/types'
import { ActivityType } from '../enums'
import { NftActivity } from '../types'
import { IActivityGenerationParameters } from '../types/activity-generation-parameters.interface'
import { generateSingleBasicActivity } from './generateSingleBasicActivity'
import { getNftId } from './outputs'

export async function generateSingleNftActivity(
    account: IAccountState,
    networkId: NetworkId,
    generationParameters: IActivityGenerationParameters,
    nftIdFromInput?: string
): Promise<NftActivity> {
    const baseActivity = await generateSingleBasicActivity(account, networkId, generationParameters)
    baseActivity.tokenTransfer = undefined

    const { output, outputId } = generationParameters.wrappedOutput
    const nftId = nftIdFromInput ? nftIdFromInput : getNftId((output as INftOutput).nftId, outputId)

    return {
        ...baseActivity,
        type: ActivityType.Nft,
        nftId,
    }
}

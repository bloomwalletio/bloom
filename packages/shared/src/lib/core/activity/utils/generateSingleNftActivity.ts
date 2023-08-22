import { IAccountState } from '@core/account'
import type { NftOutput } from '@iota/sdk/out/types'
import { ActivityType } from '../enums'
import { NftActivity } from '../types'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getLayer2ActivityInformation,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { IActivityGenerationParameters } from '../types/activity-generation-parameters.interface'
import { getNftId } from './outputs'

export function generateSingleNftActivity(
    account: IAccountState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters,
    nftIdFromInput?: string
): NftActivity {
    const { claimingData, time, inclusionState, transactionId, direction } = processedTransaction
    const outputId = wrappedOutput.outputId
    const output = wrappedOutput.output as NftOutput
    const id = outputId || transactionId

    const isHidden = false
    const isAssetHidden = false
    const containsValue = true

    const nftId = nftIdFromInput ? nftIdFromInput : getNftId(output.nftId, outputId)
    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, account)
    const { subject, isInternal } = sendingInfo

    const rawBaseCoinAmount = getAmountFromOutput(output)
    const storageDeposit = getStorageDepositFromOutput(output)

    const layer2ActivityInformation = getLayer2ActivityInformation(metadata, sendingInfo)

    const asyncData = getAsyncDataFromOutput(output, outputId, claimingData, account)

    return {
        type: ActivityType.Nft,
        id,
        transactionId,
        outputId,
        nftId,
        chainId: undefined, // Currently we only support L1 activities
        time,
        isHidden,
        action,
        rawBaseCoinAmount,
        isAssetHidden,
        containsValue,
        inclusionState,
        storageDeposit,
        metadata,
        tag,
        asyncData,
        subject,
        isInternal,
        direction,
        ...layer2ActivityInformation,
    }
}

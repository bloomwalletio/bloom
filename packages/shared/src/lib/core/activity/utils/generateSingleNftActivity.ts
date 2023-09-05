import { IAccountState } from '@core/account'
import { parseLayer2Metadata } from '@core/layer-2'
import { getNetworkIdFromAddress } from '@core/layer-2/actions'
import { NetworkId } from '@core/network/types'
import type { INftOutput } from '@iota/types'
import { ActivityType } from '../enums'
import { NftActivity } from '../types'
import { IActivityGenerationParameters } from '../types/activity-generation-parameters.interface'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { getNftId } from './outputs'
import { isStardustNetwork } from '@core/network/utils'

export function generateSingleNftActivity(
    account: IAccountState,
    networkId: NetworkId,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters,
    nftIdFromInput?: string
): NftActivity {
    const { claimingData, time, inclusionState, transactionId, direction } = processedTransaction
    const outputId = wrappedOutput.outputId
    const output = wrappedOutput.output as INftOutput
    const id = outputId || transactionId

    const isHidden = false
    const isAssetHidden = false
    const containsValue = true

    const nftId = nftIdFromInput ? nftIdFromInput : getNftId(output.nftId, outputId)
    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)

    const rawBaseCoinAmount = getAmountFromOutput(output)
    const storageDeposit = getStorageDepositFromOutput(output)

    const { sender, recipient, subject, isInternal } = getSendingInformation(
        processedTransaction,
        output,
        account,
        networkId
    )
    const sourceNetworkId = getNetworkIdFromAddress(sender?.address, networkId)
    const destinationNetworkId = getNetworkIdFromAddress(recipient?.address, sourceNetworkId)

    const asyncData = getAsyncDataFromOutput(output, outputId, claimingData, account)

    const isToLayer2 = isStardustNetwork(sourceNetworkId) && sourceNetworkId !== destinationNetworkId
    const parsedLayer2Metadata = isToLayer2 ? parseLayer2Metadata(metadata) : undefined

    return {
        type: ActivityType.Nft,
        id,
        transactionId,
        outputId,
        nftId,
        sourceNetworkId,
        destinationNetworkId: destinationNetworkId,
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
        parsedLayer2Metadata,
    }
}

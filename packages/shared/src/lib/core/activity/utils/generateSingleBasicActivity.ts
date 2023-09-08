import { isShimmerClaimingTransaction } from '@contexts/onboarding/stores'
import { IAccountState } from '@core/account'
import { BasicOutput } from '@iota/sdk/out/types'
import { IActivityGenerationParameters } from '@core/activity/types'
import { parseLayer2Metadata } from '@core/layer-2'
import { getNetworkIdFromAddress } from '@core/layer-2/actions'
import { NetworkId } from '@core/network/types'
import { activeProfileId } from '@core/profile/stores'
import { BASE_TOKEN_ID } from '@core/token'
import { get } from 'svelte/store'
import { activityOutputContainsValue } from '..'
import { ActivityType } from '../enums'
import { TransactionActivity } from '../types'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { getNativeTokenFromOutput } from './outputs'
import { isStardustNetwork } from '@core/network/utils'

export async function generateSingleBasicActivity(
    account: IAccountState,
    networkId: NetworkId,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters,
    overrideTokenId?: string,
    overrideAmount?: number
): Promise<TransactionActivity> {
    const { transactionId, direction, claimingData, time, inclusionState } = processedTransaction

    const isHidden = false
    const isTokenHidden = false
    const containsValue = await activityOutputContainsValue(wrappedOutput)

    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const output = wrappedOutput.output as BasicOutput

    const isShimmerClaiming = isShimmerClaimingTransaction(transactionId, get(activeProfileId))

    const tag = getTagFromOutput(output)
    const metadata = getMetadataFromOutput(output)
    const publicNote = ''

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

    const rawBaseCoinAmount = getAmountFromOutput(output)
    const storageDeposit = getStorageDepositFromOutput(output)

    const actualAmountSent = parsedLayer2Metadata?.baseTokens ? Number(parsedLayer2Metadata.baseTokens) : 0
    const sentDelta = rawBaseCoinAmount - actualAmountSent
    const transactionFee = isToLayer2 ? sentDelta : undefined

    const nativeToken = await getNativeTokenFromOutput(output)
    const tokenId = overrideTokenId ?? nativeToken?.id ?? BASE_TOKEN_ID

    let rawAmount: number
    if (overrideAmount === undefined) {
        rawAmount = nativeToken
            ? Number(nativeToken?.amount)
            : rawBaseCoinAmount - storageDeposit - (transactionFee ?? 0)
    } else {
        rawAmount = overrideAmount
    }

    return {
        type: ActivityType.Basic,
        isHidden,
        id,
        transactionId,
        time,
        direction,
        action,
        isAssetHidden: isTokenHidden,
        inclusionState,
        containsValue,
        outputId,
        storageDeposit,
        rawBaseCoinAmount,
        rawAmount,
        isShimmerClaiming,
        publicNote,
        metadata,
        tag,
        sourceNetworkId,
        destinationNetworkId,
        tokenId,
        asyncData,
        parsedLayer2Metadata,
        subject,
        isInternal,
        transactionFee,
    }
}

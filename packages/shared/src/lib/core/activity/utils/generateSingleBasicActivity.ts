import { isShimmerClaimingTransaction } from '@contexts/onboarding/stores'
import { IAccountState } from '@core/account'
import { IActivityGenerationParameters } from '@core/activity/types'
import { getCoinType } from '@core/profile/actions'
import { activeProfileId } from '@core/profile/stores'
import { IBasicOutput } from '@iota/types'
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
import { NetworkId } from '@core/network/types'

export function generateSingleBasicActivity(
    account: IAccountState,
    networkId: NetworkId,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters,
    fallbackTokenId?: string,
    fallbackAmount?: number
): TransactionActivity {
    const { transactionId, direction, claimingData, time, inclusionState } = processedTransaction

    const isHidden = false
    const isTokenHidden = false
    const containsValue = activityOutputContainsValue(wrappedOutput)

    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const output = wrappedOutput.output as IBasicOutput

    const isShimmerClaiming = isShimmerClaimingTransaction(transactionId, get(activeProfileId))

    const tag = getTagFromOutput(output)
    const metadata = getMetadataFromOutput(output)
    const publicNote = ''

    const sendingInfo = getSendingInformation(processedTransaction, output, account, networkId)
    const asyncData = getAsyncDataFromOutput(output, outputId, claimingData, account)

    // const { parsedLayer2Metadata, destinationNetwork } = getLayer2ActivityInformation(metadata, sendingInfo)
    // const gasLimit = Number(parsedLayer2Metadata?.gasLimit ?? '0')
    const gasLimit = 0

    const storageDeposit = getStorageDepositFromOutput(output)

    const rawBaseCoinAmount = getAmountFromOutput(output)

    const nativeToken = getNativeTokenFromOutput(output)
    const tokenId = fallbackTokenId ?? nativeToken?.id ?? getCoinType()

    let rawAmount: number
    if (fallbackAmount === undefined) {
        rawAmount = nativeToken ? Number(nativeToken?.amount) : rawBaseCoinAmount - storageDeposit - gasLimit
    } else {
        rawAmount = fallbackAmount
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
        networkId,
        tokenId,
        asyncData,
        // destinationNetwork,
        // parsedLayer2Metadata,
        ...sendingInfo,
    }
}

import { BasicOutput } from '@iota/sdk'
import { IAccountState } from '@core/account'
import { BaseActivity, IActivityGenerationParameters } from '@core/activity/types'
import { getNetworkIdFromAddress } from '@core/layer-2/actions'
import { getActiveNetworkId } from '@core/network'
import { NetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { activityOutputContainsValue } from '..'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { getNativeTokenFromOutput } from './outputs'

export async function generateBaseActivity(
    account: IAccountState,
    networkId: NetworkId,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<BaseActivity> {
    // meta information
    const isHidden = false
    const isTokenHidden = false
    const containsValue = await activityOutputContainsValue(wrappedOutput)

    // transaction information
    const output = wrappedOutput.output as BasicOutput
    const transactionId = processedTransaction.transactionId
    const outputId = wrappedOutput.outputId
    const time = processedTransaction.time
    const inclusionState = processedTransaction.inclusionState
    const tag = getTagFromOutput(output)
    const metadata = getMetadataFromOutput(output)
    const asyncData = getAsyncDataFromOutput(output, outputId, processedTransaction.claimingData, account)

    // sender / recipient information
    const { recipient, subject, isInternal } = getSendingInformation(processedTransaction, output, account, networkId)

    // this function is only used to generate an activity on the stardust network
    // even if we unwrap a token the second transaction is sent from the stardust alias
    // controlling the sub chain to our stardust address
    const sourceNetworkId = getActiveNetworkId()
    const destinationNetworkId = getNetworkIdFromAddress(recipient?.address, sourceNetworkId)
    const direction = processedTransaction.direction

    // asset information
    const storageDeposit = getStorageDepositFromOutput(output)
    const baseTokenTransfer = {
        tokenId: BASE_TOKEN_ID,
        rawAmount: String(getAmountFromOutput(output) - storageDeposit),
    }
    const nativeToken = await getNativeTokenFromOutput(output)
    const persistedToken = nativeToken
        ? await getOrRequestTokenFromPersistedTokens(nativeToken.id, sourceNetworkId)
        : undefined
    const tokenTransfer =
        persistedToken && nativeToken
            ? {
                  tokenId: persistedToken.id,
                  rawAmount: String(nativeToken.amount),
              }
            : undefined

    return {
        // meta information
        id: outputId || transactionId,
        action,
        isHidden,
        isTokenHidden,
        containsValue,

        // transaction information
        outputId,
        transactionId,
        time,
        inclusionState,
        metadata,
        tag,
        asyncData,

        // sender / recipient information
        sourceNetworkId,
        destinationNetworkId,
        subject,
        direction,
        isInternal,

        // asset information
        storageDeposit,
        baseTokenTransfer,
        tokenTransfer,
    }
}

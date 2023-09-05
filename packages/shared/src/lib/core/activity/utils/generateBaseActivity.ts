import { IAccountState } from '@core/account'
import { BaseActivity, IActivityGenerationParameters } from '@core/activity/types'
import { getNetworkIdFromAddress } from '@core/layer-2/actions'
import { NetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token'
import { getPersistedToken } from '@core/token/stores'
import { IBasicOutput } from '@iota/types'
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
import { TokenTransferData } from '@core/wallet'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'

export async function generateBaseActivity(
    account: IAccountState,
    networkId: NetworkId,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<BaseActivity> {
    // meta information
    const isHidden = false
    const isTokenHidden = false
    const containsValue = activityOutputContainsValue(wrappedOutput)

    // transaction information
    const output = wrappedOutput.output as IBasicOutput
    const transactionId = processedTransaction.transactionId
    const outputId = wrappedOutput.outputId
    const time = processedTransaction.time
    const inclusionState = processedTransaction.inclusionState
    const tag = getTagFromOutput(output)
    const metadata = getMetadataFromOutput(output)
    const asyncData = getAsyncDataFromOutput(output, outputId, processedTransaction.claimingData, account)

    // sender / recipient information
    const { sender, recipient, subject, isInternal } = getSendingInformation(
        processedTransaction,
        output,
        account,
        networkId
    )
    const sourceNetworkId = getNetworkIdFromAddress(sender?.address, networkId)
    const destinationNetworkId = getNetworkIdFromAddress(recipient?.address, sourceNetworkId)
    const direction = processedTransaction.direction

    // asset information
    const storageDeposit = getStorageDepositFromOutput(output)
    const baseTokenTransfer: TokenTransferData = {
        token: { ...getPersistedToken(BASE_TOKEN_ID), networkId: sourceNetworkId },
        rawAmount: String(getAmountFromOutput(output) - storageDeposit),
    }
    const nativeToken = getNativeTokenFromOutput(output)
    const persistedToken = nativeToken
        ? await getOrRequestTokenFromPersistedTokens(nativeToken.id, sourceNetworkId)
        : undefined
    const tokenTransfer: TokenTransferData | undefined =
        persistedToken && nativeToken
            ? {
                  token: { ...persistedToken, networkId: sourceNetworkId },
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

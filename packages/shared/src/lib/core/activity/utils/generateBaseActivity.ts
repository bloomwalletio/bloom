import { IAccountState } from '@core/account'
import { BaseActivity, IActivityGenerationParameters } from '@core/activity/types'
import { getNetworkIdFromAddress } from '@core/layer-2/actions'
import { NetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token'
import { BasicOutput } from '@iota/sdk'
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
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { getActiveNetworkId, isStardustNetwork } from '@core/network'
import { parseLayer2Metadata } from '@core/layer-2/utils'
import { getSubjectFromAddress } from '@core/wallet/utils'
import { HEX_PREFIX } from '@core/utils'
import { SubjectType } from '@core/wallet'

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
    let { recipient, sender, subject, isInternal } = getSendingInformation(
        processedTransaction,
        output,
        account,
        networkId
    )

    // this function is only used to generate an activity on the stardust network
    // even if we unwrap a token the second transaction is sent from the stardust alias
    // controlling the sub chain to our stardust address
    const sourceNetworkId = getActiveNetworkId()
    const destinationNetworkId = getNetworkIdFromAddress(recipient?.address) ?? sourceNetworkId
    const direction = processedTransaction.direction

    // asset information
    const storageDeposit = getStorageDepositFromOutput(output)
    const baseTokenTransfer = {
        tokenId: BASE_TOKEN_ID,
        rawAmount: getAmountFromOutput(output) - storageDeposit,
    }
    const nativeToken = await getNativeTokenFromOutput(output)
    const persistedToken = nativeToken
        ? await getOrRequestTokenFromPersistedTokens(nativeToken.id, sourceNetworkId)
        : undefined
    const tokenTransfer =
        persistedToken && nativeToken
            ? {
                  tokenId: persistedToken.id,
                  rawAmount: BigInt(nativeToken.amount),
              }
            : undefined

    const isL1toL2 = isStardustNetwork(sourceNetworkId) && sourceNetworkId !== destinationNetworkId
    const smartContract = isL1toL2 ? parseLayer2Metadata(metadata) : undefined

    if (recipient?.type === SubjectType.Network && smartContract?.ethereumAddress) {
        const l2Address =
            HEX_PREFIX + smartContract.ethereumAddress.substring(smartContract.ethereumAddress.length - 40)
        const l2Recipient = getSubjectFromAddress(l2Address, destinationNetworkId)

        if (recipient.address === subject?.address) {
            subject = l2Recipient
        }
        recipient = l2Recipient
    }

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
        sender,
        recipient,
        subject,
        direction,
        isInternal,

        // asset information
        storageDeposit,
        baseTokenTransfer,
        tokenTransfer,
        smartContract,
    }
}

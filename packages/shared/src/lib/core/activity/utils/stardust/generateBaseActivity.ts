import { IAccountState } from '@core/account'
import { BaseStardustActivity, IActivityGenerationParameters } from '@core/activity/types'
import { getNetworkFromAddress } from '@core/layer-2/actions'
import { StardustNetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token'
import { BasicOutput } from '@iota/sdk'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from '../helper'
import { getNativeTokenFromOutput } from '../outputs'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { NetworkNamespace, getActiveNetworkId, isStardustNetwork } from '@core/network'
import { parseLayer2Metadata } from '@core/layer-2/utils'
import { getSubjectFromAddress } from '@core/wallet/utils'
import { HEX_PREFIX } from '@core/utils'
import { SubjectType } from '@core/wallet'
import { isSpamTransaction } from './isSpamTransaction'

export async function generateBaseActivity(
    account: IAccountState,
    networkId: StardustNetworkId,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<BaseStardustActivity> {
    // meta information
    const isHidden = false
    const isTokenHidden = false
    const isSpam = await isSpamTransaction(wrappedOutput, processedTransaction)

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
    const destinationNetworkId = getNetworkFromAddress(recipient?.address)?.id ?? sourceNetworkId
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
        namespace: NetworkNamespace.Stardust,

        // meta information
        id: outputId || transactionId,
        action,
        isHidden,
        isTokenHidden,
        isSpam,

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

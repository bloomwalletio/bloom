import { IAccountState } from '@core/account'
import { IActivityGenerationParameters } from '@core/activity/types'
import { NetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token'
import { ADDRESS_TYPE_ALIAS, UNLOCK_CONDITION_IMMUTABLE_ALIAS } from '@core/wallet/constants'
import { convertHexAddressToBech32 } from '@core/wallet/utils'
import type { IAliasAddress, IFoundryOutput, IImmutableAliasUnlockCondition } from '@iota/types'
import { ActivityType } from '../enums'
import { FoundryActivity } from '../types'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getTagFromOutput,
} from './helper'
import { getNativeTokenFromOutput } from './outputs'

export function generateSingleFoundryActivity(
    account: IAccountState,
    networkId: NetworkId,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): FoundryActivity {
    const { transactionId, claimingData, time, direction, inclusionState } = processedTransaction

    const output = wrappedOutput.output as IFoundryOutput
    const outputId = wrappedOutput.outputId
    const { mintedTokens, meltedTokens, maximumSupply } = output.tokenScheme

    const addressUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UNLOCK_CONDITION_IMMUTABLE_ALIAS
    ) as IImmutableAliasUnlockCondition
    const aliasId = (addressUnlockCondition?.address as IAliasAddress)?.aliasId
    const aliasAddress = aliasId ? convertHexAddressToBech32(ADDRESS_TYPE_ALIAS, aliasId) : undefined

    const isHidden = false
    const isAssetHidden = false
    const containsValue = true

    const id = outputId || transactionId
    const nativeToken = getNativeTokenFromOutput(output)
    const tokenId = nativeToken?.id ?? BASE_TOKEN_ID

    const storageDeposit = getAmountFromOutput(output)
    const rawAmount = Number(nativeToken?.amount ?? 0)
    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, account, networkId)
    const asyncData = getAsyncDataFromOutput(output, outputId, claimingData, account)

    return {
        type: ActivityType.Foundry,
        id,
        outputId,
        transactionId,
        direction,
        action,
        tokenId,
        aliasAddress,
        mintedTokens,
        meltedTokens,
        maximumSupply,
        storageDeposit,
        rawAmount,
        time,
        inclusionState,
        containsValue,
        isAssetHidden,
        isHidden,
        metadata,
        tag,
        sourceNetworkId: networkId,
        destinationNetworkId: networkId,
        asyncData,
        ...sendingInfo,
    }
}

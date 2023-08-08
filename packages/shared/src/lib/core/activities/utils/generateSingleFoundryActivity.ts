import { IAccountState } from '@core/account'
import { getCoinType } from '@core/profile'
import { ADDRESS_TYPE_ALIAS, UNLOCK_CONDITION_IMMUTABLE_ALIAS } from '@core/wallet/constants'
import { ActivityType } from '../enums'
import { IActivityGenerationParameters } from '@core/activities/types'
import { FoundryActivity } from '../types'
import type { IAliasAddress, IFoundryOutput, IImmutableAliasUnlockCondition } from '@iota/types'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getTagFromOutput,
} from './helper'
import { getNativeTokenFromOutput } from './outputs'
import { convertHexAddressToBech32 } from '@core/wallet/utils'

export function generateSingleFoundryActivity(
    account: IAccountState,
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
    const assetId = nativeToken?.id ?? getCoinType()

    const storageDeposit = getAmountFromOutput(output)
    const rawAmount = Number(nativeToken?.amount ?? 0)
    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, account)
    const asyncData = getAsyncDataFromOutput(output, outputId, claimingData, account)

    return {
        type: ActivityType.Foundry,
        id,
        outputId,
        transactionId,
        direction,
        action,
        assetId,
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
        asyncData,
        ...sendingInfo,
    }
}

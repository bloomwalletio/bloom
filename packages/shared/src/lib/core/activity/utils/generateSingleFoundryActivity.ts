import { IAccountState } from '@core/account'
import {
    AddressType,
    AliasAddress,
    FoundryOutput,
    ImmutableAliasAddressUnlockCondition,
    SimpleTokenScheme,
    UnlockConditionType,
} from '@iota/sdk/out/types'
import { IActivityGenerationParameters } from '@core/activity/types'
import { getCoinType } from '@core/profile/actions'
import { convertHexAddressToBech32 } from '@core/wallet/utils'
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

export async function generateSingleFoundryActivity(
    account: IAccountState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<FoundryActivity> {
    const { transactionId, claimingData, time, direction, inclusionState } = processedTransaction

    const output = wrappedOutput.output as FoundryOutput
    const outputId = wrappedOutput.outputId
    const { mintedTokens, meltedTokens, maximumSupply } = output.tokenScheme as SimpleTokenScheme

    const addressUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.ImmutableAliasAddress
    ) as ImmutableAliasAddressUnlockCondition
    const aliasId = (addressUnlockCondition?.address as AliasAddress)?.aliasId
    const aliasAddress = aliasId ? convertHexAddressToBech32(AddressType.Alias, aliasId) : undefined

    const isHidden = false
    const isAssetHidden = false
    const containsValue = true

    const id = outputId || transactionId
    const nativeToken = await getNativeTokenFromOutput(output)
    const tokenId = nativeToken?.id ?? getCoinType()

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
        tokenId,
        aliasAddress,
        mintedTokens: mintedTokens.toString(),
        meltedTokens: meltedTokens.toString(),
        maximumSupply: maximumSupply.toString(),
        storageDeposit,
        rawAmount,
        time,
        inclusionState,
        containsValue,
        isAssetHidden,
        isHidden,
        metadata,
        tag,
        chainId: undefined,
        asyncData,
        ...sendingInfo,
    }
}

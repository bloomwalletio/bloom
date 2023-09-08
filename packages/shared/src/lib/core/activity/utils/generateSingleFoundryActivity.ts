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
import { NetworkId } from '@core/network/types'
import { convertHexAddressToBech32 } from '@core/wallet/utils'
import { ActivityType } from '../enums'
import { FoundryActivity } from '../types'
import { generateBaseActivity } from './generateBaseActivity'

export async function generateSingleFoundryActivity(
    account: IAccountState,
    networkId: NetworkId,
    generationParameters: IActivityGenerationParameters
): Promise<FoundryActivity> {
    const baseActivity = await generateBaseActivity(account, networkId, generationParameters)

    const output = generationParameters.wrappedOutput.output as FoundryOutput
    const { mintedTokens, meltedTokens, maximumSupply } = output.tokenScheme as SimpleTokenScheme

    const addressUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.ImmutableAliasAddress
    ) as ImmutableAliasAddressUnlockCondition
    const aliasId = (addressUnlockCondition?.address as AliasAddress)?.aliasId
    const aliasAddress = convertHexAddressToBech32(AddressType.Alias, aliasId)

    return {
        ...baseActivity,
        type: ActivityType.Foundry,
        aliasAddress,
        mintedTokens: mintedTokens.toString(),
        meltedTokens: meltedTokens.toString(),
        maximumSupply: maximumSupply.toString(),
        containsValue: true, // TODO: check if why we do this
    }
}

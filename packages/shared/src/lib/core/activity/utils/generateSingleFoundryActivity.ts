import { IAccountState } from '@core/account'
import { IActivityGenerationParameters } from '@core/activity/types'
import { NetworkId } from '@core/network/types'
import { ADDRESS_TYPE_ALIAS, UNLOCK_CONDITION_IMMUTABLE_ALIAS } from '@core/wallet/constants'
import { convertHexAddressToBech32 } from '@core/wallet/utils'
import type { IAliasAddress, IFoundryOutput, IImmutableAliasUnlockCondition } from '@iota/types'
import { ActivityType } from '../enums'
import { FoundryActivity } from '../types'
import { generateBaseActivity } from './generateBaseActivity'

export async function generateSingleFoundryActivity(
    account: IAccountState,
    networkId: NetworkId,
    generationParameters: IActivityGenerationParameters
): Promise<FoundryActivity> {
    const baseActivity = await generateBaseActivity(account, networkId, generationParameters)

    const output = generationParameters.wrappedOutput.output as IFoundryOutput
    const { mintedTokens, meltedTokens, maximumSupply } = output.tokenScheme

    const addressUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UNLOCK_CONDITION_IMMUTABLE_ALIAS
    ) as IImmutableAliasUnlockCondition
    const aliasId = (addressUnlockCondition?.address as IAliasAddress)?.aliasId
    const aliasAddress = convertHexAddressToBech32(ADDRESS_TYPE_ALIAS, aliasId)

    return {
        ...baseActivity,
        type: ActivityType.Foundry,
        aliasAddress,
        mintedTokens,
        meltedTokens,
        maximumSupply,
        containsValue: true, // TODO: check if why we do this
    }
}

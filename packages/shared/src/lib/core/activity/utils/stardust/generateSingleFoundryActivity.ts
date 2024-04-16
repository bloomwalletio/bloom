import { IAccountState } from '@core/account'
import { IActivityGenerationParameters } from '@core/activity/types'
import { StardustNetworkId } from '@core/network/types'
import { BASE_TOKEN_ID } from '@core/token'
import { convertHexAddressToBech32 } from '@core/wallet/utils'
import {
    AddressType,
    AliasAddress,
    FoundryOutput,
    ImmutableAliasAddressUnlockCondition,
    SimpleTokenScheme,
    UnlockConditionType,
} from '@iota/sdk/out/types'
import { ActivityAction, StardustActivityType } from '../../enums'
import { StardustFoundryActivity } from '../../types'
import { generateBaseActivity } from './generateBaseActivity'
import { SubjectType } from '@core/wallet/enums'

export async function generateSingleFoundryActivity(
    account: IAccountState,
    networkId: StardustNetworkId,
    generationParameters: IActivityGenerationParameters
): Promise<StardustFoundryActivity> {
    const baseActivity = await generateBaseActivity(account, networkId, generationParameters)

    const output = generationParameters.wrappedOutput.output as FoundryOutput

    const tokenScheme = output.tokenScheme as SimpleTokenScheme
    // SimpleTokenScheme states that the numbers are of type bigint but they are actually hex encoded
    // Reoponed issue https://github.com/iotaledger/iota-sdk/issues/1839
    // TODO: Remove the casting once issue in sdk is fixed
    const mintedTokens = BigInt(tokenScheme.mintedTokens)
    const meltedTokens = BigInt(tokenScheme.meltedTokens)
    const maximumSupply = BigInt(tokenScheme.maximumSupply)

    if (generationParameters.action === ActivityAction.Mint) {
        baseActivity.storageDeposit = baseActivity.baseTokenTransfer?.rawAmount
            ? baseActivity.baseTokenTransfer?.rawAmount
            : undefined
        baseActivity.baseTokenTransfer = {
            tokenId: BASE_TOKEN_ID,
            rawAmount: BigInt(0),
        }
    }

    const addressUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.ImmutableAliasAddress
    ) as ImmutableAliasAddressUnlockCondition
    const aliasId = (addressUnlockCondition?.address as AliasAddress)?.aliasId
    const aliasAddress = convertHexAddressToBech32(AddressType.Alias, aliasId)

    return {
        ...baseActivity,
        recipient: { type: SubjectType.Account, account, address: account.depositAddress },
        type: StardustActivityType.Foundry,
        aliasAddress,
        mintedTokens,
        meltedTokens,
        maximumSupply,
    }
}

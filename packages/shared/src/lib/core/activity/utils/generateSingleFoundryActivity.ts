import { IAccountState } from '@core/account'
import { IActivityGenerationParameters } from '@core/activity/types'
import { NetworkId } from '@core/network/types'
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
import { ActivityAction, ActivityType } from '../enums'
import { FoundryActivity } from '../types'
import { generateBaseActivity } from './generateBaseActivity'
import { SubjectType } from '@core/wallet/enums'

export async function generateSingleFoundryActivity(
    account: IAccountState,
    networkId: NetworkId,
    generationParameters: IActivityGenerationParameters
): Promise<FoundryActivity> {
    const baseActivity = await generateBaseActivity(account, networkId, generationParameters)

    const output = generationParameters.wrappedOutput.output as FoundryOutput
    const { mintedTokens, meltedTokens, maximumSupply } = output.tokenScheme as SimpleTokenScheme

    if (generationParameters.action === ActivityAction.Mint) {
        baseActivity.storageDeposit = baseActivity.baseTokenTransfer?.rawAmount
            ? Number(baseActivity.baseTokenTransfer?.rawAmount)
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
        type: ActivityType.Foundry,
        aliasAddress,
        mintedTokens: mintedTokens.toString(),
        meltedTokens: meltedTokens.toString(),
        maximumSupply: maximumSupply.toString(),
        containsValue: true, // TODO: check if why we do this
    }
}

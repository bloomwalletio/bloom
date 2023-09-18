import {
    AddressType,
    AliasAddress,
    FoundryOutput,
    ImmutableAliasAddressUnlockCondition,
    UnlockConditionType,
} from '@iota/sdk/out/types'
import { api } from '@core/profile-manager'

export function buildFoundryId(foundry: FoundryOutput): Promise<string> {
    const unlockCondition = foundry.unlockConditions[0] as ImmutableAliasAddressUnlockCondition
    const isImmutableAliasAddress = unlockCondition.type === UnlockConditionType.ImmutableAliasAddress

    let aliasId = ''

    if (isImmutableAliasAddress) {
        const hasAliasAddress = unlockCondition.address.type === AddressType.Alias
        if (hasAliasAddress) {
            aliasId = (unlockCondition.address as AliasAddress).aliasId
        }
    }

    return api.computeFoundryId(aliasId, foundry.serialNumber, foundry.tokenScheme.type)
}

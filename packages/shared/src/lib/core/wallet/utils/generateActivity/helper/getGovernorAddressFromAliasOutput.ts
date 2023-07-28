import { AliasOutput, GovernorAddressUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types/block/output'
import { getBech32AddressFromAddressTypes } from '../../getBech32AddressFromAddressTypes'

export function getGovernorAddressFromAliasOutput(output: AliasOutput): string {
    const governorUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.GovernorAddress
    ) as GovernorAddressUnlockCondition
    return getBech32AddressFromAddressTypes(governorUnlockCondition.address)
}

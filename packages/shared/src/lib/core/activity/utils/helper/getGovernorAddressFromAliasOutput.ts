import { AliasOutput, GovernorAddressUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils'

export function getGovernorAddressFromAliasOutput(output: AliasOutput): string {
    const governorUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.GovernorAddress
    ) as GovernorAddressUnlockCondition
    return getBech32AddressFromAddressTypes(governorUnlockCondition.address)
}

import { getBech32AddressFromAddressTypes } from '@core/wallet/utils'
import { StateControllerAddressUnlockCondition, AliasOutput, UnlockConditionType } from '@iota/sdk/out/types'

export function getStateControllerAddressFromAliasOutput(output: AliasOutput): string {
    const stateControllerUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.StateControllerAddress
    ) as StateControllerAddressUnlockCondition
    return getBech32AddressFromAddressTypes(stateControllerUnlockCondition.address)
}

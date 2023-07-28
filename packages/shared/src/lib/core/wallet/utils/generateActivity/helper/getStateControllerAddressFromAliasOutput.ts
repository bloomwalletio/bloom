import {
    StateControllerAddressUnlockCondition,
    AliasOutput,
    UnlockConditionType,
} from '@iota/sdk/out/types/block/output'
import { getBech32AddressFromAddressTypes } from '../../getBech32AddressFromAddressTypes'

export function getStateControllerAddressFromAliasOutput(output: AliasOutput): string {
    const stateControllerUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UnlockConditionType.StateControllerAddress
    ) as StateControllerAddressUnlockCondition
    return getBech32AddressFromAddressTypes(stateControllerUnlockCondition.address)
}

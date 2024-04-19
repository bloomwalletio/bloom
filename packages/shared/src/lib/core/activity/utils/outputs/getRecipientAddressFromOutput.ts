import {
    CommonOutput,
    UnlockConditionType,
    AddressUnlockCondition,
    StateControllerAddressUnlockCondition,
    UnlockCondition,
} from '@iota/sdk/out/types'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils'

export function getRecipientAddressFromOutput(output: CommonOutput): string | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (containsAddress(unlockCondition)) {
            return getBech32AddressFromAddressTypes(unlockCondition.address)
        }
    }
}

function containsAddress(
    unlockCondition: UnlockCondition
): unlockCondition is AddressUnlockCondition | StateControllerAddressUnlockCondition {
    const { type } = unlockCondition
    return type === UnlockConditionType.Address || type === UnlockConditionType.StateControllerAddress
}

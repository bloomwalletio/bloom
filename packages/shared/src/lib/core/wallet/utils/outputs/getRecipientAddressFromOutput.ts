import { UnlockConditionType } from '@iota/sdk/out/types'
import { Output } from '../../types'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'

export function getRecipientAddressFromOutput(output: Output): string | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition.type === UnlockConditionType.Address) {
            return getBech32AddressFromAddressTypes(unlockCondition.address)
        }
    }
}

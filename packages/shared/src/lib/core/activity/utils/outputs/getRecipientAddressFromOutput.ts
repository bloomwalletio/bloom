import { UNLOCK_CONDITION_ADDRESS } from '@core/wallet/constants'
import { Output } from '@core/wallet/types'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils'

export function getRecipientAddressFromOutput(output: Output): string {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition.type === UNLOCK_CONDITION_ADDRESS) {
            return getBech32AddressFromAddressTypes(unlockCondition.address)
        }
    }
}

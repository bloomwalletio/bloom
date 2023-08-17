import { UnlockConditionType } from '@iota/sdk/out/types'
import { Output } from '@core/wallet/types'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils'

export function getRecipientAddressFromOutput(output: Output): string | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition.type === UnlockConditionType.Address) {
            return getBech32AddressFromAddressTypes(unlockCondition.address)
        }
    }
}

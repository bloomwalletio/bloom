import { UnlockConditionType, AddressUnlockCondition } from '@iota/sdk/out/types'
import { Output } from '@core/wallet/types'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils'

export function getRecipientAddressFromOutput(output: Output): string | undefined {
    for (const unlockCondition of output.unlockConditions) {
        if (unlockCondition.type === UnlockConditionType.Address) {
            const addressUnlockCondition = unlockCondition as AddressUnlockCondition
            return getBech32AddressFromAddressTypes(addressUnlockCondition.address)
        }
    }
}

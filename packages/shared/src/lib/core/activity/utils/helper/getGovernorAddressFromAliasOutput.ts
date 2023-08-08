import { UNLOCK_CONDITION_GOVERNOR_ADDRESS } from '@core/wallet/constants'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils'
import { IGovernorAddressUnlockCondition, IAliasOutput } from '@iota/types'

export function getGovernorAddressFromAliasOutput(output: IAliasOutput): string {
    const governorUnlockCondition = output.unlockConditions.find(
        (unlockCondition) => unlockCondition.type === UNLOCK_CONDITION_GOVERNOR_ADDRESS
    ) as IGovernorAddressUnlockCondition
    return getBech32AddressFromAddressTypes(governorUnlockCondition.address)
}

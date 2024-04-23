import { NetworkNamespace } from '@core/network/enums'
import { EvmActivityType } from '../enums/evm'
import { Activity, EvmBalanceChangeActivity, EvmTokenMintingActivity, EvmTokenTransferActivity } from '../types'

export function isEvmTokenActivity(
    activity: Activity
): activity is EvmBalanceChangeActivity | EvmTokenMintingActivity | EvmTokenTransferActivity {
    return (
        activity.namespace === NetworkNamespace.Evm &&
        (activity.type === EvmActivityType.TokenTransfer ||
            activity.type === EvmActivityType.TokenMinting ||
            activity.type === EvmActivityType.BalanceChange)
    )
}

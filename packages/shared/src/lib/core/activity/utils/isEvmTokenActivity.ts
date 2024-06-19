import { NetworkNamespace } from '@core/network/enums'
import { EvmActivityType } from '../enums/evm'
import {
    Activity,
    EvmBalanceChangeActivity,
    EvmTokenApprovalActivity,
    EvmTokenMintingActivity,
    EvmTokenTransferActivity,
} from '../types'

export function isEvmTokenActivity(
    activity: Activity
): activity is
    | EvmBalanceChangeActivity
    | EvmTokenMintingActivity
    | EvmTokenTransferActivity
    | EvmTokenApprovalActivity {
    return (
        activity.namespace === NetworkNamespace.Evm &&
        (activity.type === EvmActivityType.TokenTransfer ||
            activity.type === EvmActivityType.TokenMinting ||
            activity.type === EvmActivityType.TokenApproval ||
            activity.type === EvmActivityType.BalanceChange)
    )
}

import { TransactionActivity } from '../types'
import { IAssetBalanceChange } from '../types'
import { ActivityAction, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { generateRandomId } from '@core/utils'
import { getCoinType } from '@core/profile/actions'

export function generateBalanceChangeActivity(
    chainId: number,
    assetId: string,
    balanceChange: IAssetBalanceChange
): TransactionActivity {
    const difference = balanceChange.newBalance - (balanceChange.oldBalance ?? 0)
    const direction = difference >= 0 ? ActivityDirection.Incoming : ActivityDirection.Outgoing

    return {
        type: ActivityType.Basic,
        id: generateRandomId(),
        time: new Date(balanceChange.changedAt),
        inclusionState: InclusionState.Confirmed,
        containsValue: true,
        isAssetHidden: false,
        direction,
        action: balanceChange.oldBalance !== undefined ? ActivityAction.BalanceChange : ActivityAction.InitialBalance,
        isInternal: false,
        storageDeposit: 0,
        subject: undefined,
        rawBaseCoinAmount: Math.abs(difference),
        rawAmount: Math.abs(difference),
        assetId: assetId === '0x' ? getCoinType() : assetId,
        chainId,
    }
}

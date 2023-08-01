import { TransactionActivity } from '@core/wallet/types'
import { IAssetBalanceChange } from '../types'
import { ActivityAction, ActivityDirection, ActivityType, InclusionState } from '@core/wallet/enums'
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
        time: new Date(),
        inclusionState: InclusionState.Confirmed,
        containsValue: true,
        isAssetHidden: false,
        direction,
        action: ActivityAction.BalanceChange,
        isInternal: false,
        storageDeposit: 0,
        subject: undefined,
        rawAmount: Math.abs(difference),
        assetId: assetId === '0x' ? getCoinType() : assetId,
        chainId,
    }
}

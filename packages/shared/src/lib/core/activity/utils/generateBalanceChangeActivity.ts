import { NetworkId } from '@core/network'
import { generateRandomId } from '@core/utils'
import { ActivityAction, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { ITokenBalanceChange, TransactionActivity } from '../types'

export function generateBalanceChangeActivity(
    networkId: NetworkId,
    tokenId: string,
    balanceChange: ITokenBalanceChange
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
        tokenId,
        sourceNetworkId: networkId,
        destinationNetworkId: networkId,
    }
}

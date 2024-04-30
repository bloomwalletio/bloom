import { get } from 'svelte/store'
import { activeAccounts } from '@core/profile/stores'
import { SendFlowType } from '@core/wallet/enums'

export function canAccountMakeStardustTransaction(
    accountIndex: number,
    sendFlowType: SendFlowType | undefined
): boolean {
    switch (sendFlowType) {
        case SendFlowType.BaseCoinTransfer:
        default: {
            const account = get(activeAccounts)?.[accountIndex]
            if (account) {
                const baseTokenBalance = account?.balances.baseCoin
                return BigInt(baseTokenBalance?.available ?? 0) > BigInt(0)
            } else {
                return false
            }
        }
    }
}

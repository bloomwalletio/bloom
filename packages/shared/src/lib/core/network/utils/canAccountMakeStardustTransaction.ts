import { get } from 'svelte/store'
import { isStardustNetwork } from '@core/network/utils'
import { activeAccounts } from '@core/profile/stores'
import { SendFlowType } from '@core/wallet/enums'
import { NetworkId } from '../types'

export function canAccountMakeStardustTransaction(
    accountIndex: number,
    networkId: NetworkId,
    sendFlowType: SendFlowType
): boolean | undefined {
    if (!isStardustNetwork(networkId)) {
        return undefined
    }

    switch (sendFlowType) {
        case SendFlowType.BaseCoinTransfer:
        default: {
            const account = get(activeAccounts)?.[accountIndex]
            if (account) {
                const baseTokenBalance = account?.balances.baseCoin
                return BigInt(baseTokenBalance?.available ?? 0) > BigInt(0)
            } else {
                return undefined
            }
        }
    }
}

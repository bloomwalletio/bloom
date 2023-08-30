import { getGasPriceInWei } from '@core/layer-2/actions/getGasPriceInWei'
import { getLayer2AccountBalanceForToken } from '@core/layer-2/stores'
import { NetworkId } from '@core/network/types'
import { isEvmChain } from '@core/network/utils'
import { getCoinType } from '@core/profile/actions'
import { SendFlowType } from '@core/wallet/stores'

import { FALLBACK_ESTIMATED_GAS, GAS_LIMIT_MULTIPLIER } from '../constants'
import { calculateGasFeeInGlow } from '../utils'

export async function canAccountMakeEvmTransaction(
    accountIndex: number,
    networkId: NetworkId,
    sendFlowType: SendFlowType
): Promise<boolean | undefined> {
    if (!isEvmChain(networkId)) {
        return undefined
    }

    const baseTokenAmount = getLayer2AccountBalanceForToken(accountIndex, networkId, getCoinType()) ?? 0
    const gasLimit = Math.floor(
        FALLBACK_ESTIMATED_GAS[sendFlowType ?? SendFlowType.BaseCoinTransfer] * GAS_LIMIT_MULTIPLIER
    )
    const gasPrice = await getGasPriceInWei(networkId)
    const minimumGasFee = calculateGasFeeInGlow(gasLimit, gasPrice)
    return BigInt(baseTokenAmount) < BigInt(minimumGasFee.toString())
}

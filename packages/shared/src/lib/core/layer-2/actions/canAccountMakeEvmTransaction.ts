import { NetworkId } from '@core/network/types'
import { isEvmChain } from '@core/network/utils'
import { SendFlowType } from '@core/wallet/enums'

import { getEvmChainGasPrice, getLayer2AccountBalanceForToken } from '../stores'

import { FALLBACK_ESTIMATED_GAS, GAS_LIMIT_MULTIPLIER } from '../constants'
import { calculateGasFeeInGlow } from '../helpers'

export function canAccountMakeEvmTransaction(
    accountIndex: number,
    networkId: NetworkId,
    sendFlowType: SendFlowType
): boolean | undefined {
    if (!isEvmChain(networkId)) {
        return undefined
    }

    const baseTokenAccountBalance = getLayer2AccountBalanceForToken(accountIndex, networkId)
    const gasLimit = Math.floor(
        FALLBACK_ESTIMATED_GAS[sendFlowType ?? SendFlowType.BaseCoinTransfer] * GAS_LIMIT_MULTIPLIER
    )
    const gasPrice = getEvmChainGasPrice(networkId)
    if (gasPrice === undefined) {
        return undefined
    }
    const minimumGasFee = calculateGasFeeInGlow(gasLimit, gasPrice)
    return baseTokenAccountBalance > minimumGasFee
}

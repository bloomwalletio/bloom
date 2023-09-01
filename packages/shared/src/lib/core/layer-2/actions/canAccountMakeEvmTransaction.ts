import { NetworkId } from '@core/network/types'
import { isEvmChain } from '@core/network/utils'
import { SendFlowType } from '@core/wallet/enums'

import { getLayer2AccountBalanceForToken } from '../stores'
import { getGasPriceInWei } from './getGasPriceInWei'

import { FALLBACK_ESTIMATED_GAS, GAS_LIMIT_MULTIPLIER } from '../constants'
import { calculateGasFeeInGlow } from '../helpers'

export async function canAccountMakeEvmTransaction(
    accountIndex: number,
    networkId: NetworkId,
    sendFlowType: SendFlowType
): Promise<boolean | undefined> {
    if (!isEvmChain(networkId)) {
        return undefined
    }

    const baseTokenAccountBalance = getLayer2AccountBalanceForToken(accountIndex, networkId) ?? 0
    const gasLimit = Math.floor(
        FALLBACK_ESTIMATED_GAS[sendFlowType ?? SendFlowType.BaseCoinTransfer] * GAS_LIMIT_MULTIPLIER
    )
    const gasPrice = await getGasPriceInWei(networkId)
    const minimumGasFee = calculateGasFeeInGlow(gasLimit, gasPrice)
    return BigInt(baseTokenAccountBalance) < BigInt(minimumGasFee.toString())
}

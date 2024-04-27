import { EvmNetworkId } from '@core/network/types'
import { SendFlowType } from '@core/wallet/enums'
import { getLayer2AccountBalanceForToken } from '../stores'
import { FALLBACK_ESTIMATED_GAS, GAS_LIMIT_MULTIPLIER } from '../constants'
import { calculateGasFeeInGlow } from '../helpers'
import { getEvmNetwork } from '@core/network'

export async function canAccountMakeEvmTransaction(
    accountIndex: number,
    networkId: EvmNetworkId,
    sendFlowType: SendFlowType | undefined
): Promise<boolean> {
    const baseTokenAccountBalance = getLayer2AccountBalanceForToken(accountIndex, networkId)
    const gasLimit = Math.floor(
        FALLBACK_ESTIMATED_GAS[sendFlowType ?? SendFlowType.BaseCoinTransfer] * GAS_LIMIT_MULTIPLIER
    )
    const gasPrice = await getEvmNetwork(networkId)?.getGasPrice()
    if (gasPrice === undefined) {
        return false
    }
    const minimumGasFee = calculateGasFeeInGlow(gasLimit, gasPrice)
    return baseTokenAccountBalance > minimumGasFee
}

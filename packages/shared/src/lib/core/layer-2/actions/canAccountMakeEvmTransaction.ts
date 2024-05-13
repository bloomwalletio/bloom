import { SendFlowType } from '@core/wallet/enums'
import { getLayer2AccountBalanceForToken } from '../stores'
import { FALLBACK_ESTIMATED_GAS, GAS_LIMIT_MULTIPLIER } from '../constants'
import { IEvmNetwork, calculateGasFee } from '@core/network'

export async function canAccountMakeEvmTransaction(
    accountIndex: number,
    network: IEvmNetwork,
    sendFlowType: SendFlowType | undefined
): Promise<boolean> {
    const baseTokenAccountBalance = getLayer2AccountBalanceForToken(accountIndex, network.id)
    const gasLimit = Math.floor(
        FALLBACK_ESTIMATED_GAS[sendFlowType ?? SendFlowType.BaseCoinTransfer] * GAS_LIMIT_MULTIPLIER
    )
    const gasPrice = await network.getGasPrice()
    if (gasPrice === undefined) {
        return false
    }

    const minimumGasFee = calculateGasFee(gasLimit, gasPrice)
    return baseTokenAccountBalance > minimumGasFee
}

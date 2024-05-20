import { SendFlowType } from '@core/wallet/enums'
import { getLayer2AccountBalanceForToken } from '../stores'
import { FALLBACK_ESTIMATED_GAS } from '../constants'
import { IEvmNetwork, calculateGasFee } from '@core/network'
import { addGasBuffer } from '../utils'

export async function canAccountMakeEvmTransaction(
    accountIndex: number,
    network: IEvmNetwork,
    sendFlowType: SendFlowType | undefined
): Promise<boolean> {
    const baseTokenAccountBalance = getLayer2AccountBalanceForToken(accountIndex, network.id)
    const gasLimit = addGasBuffer(FALLBACK_ESTIMATED_GAS[sendFlowType ?? SendFlowType.BaseCoinTransfer])

    const gasPrice = await network.getRequiredGasPrice()
    if (gasPrice === undefined) {
        return false
    }

    const minimumGasFee = calculateGasFee(gasLimit, gasPrice)
    return baseTokenAccountBalance > minimumGasFee
}

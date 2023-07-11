import { NewTokenTransactionDetails, NewTransactionDetails, getAddressFromSubject } from '@core/wallet'
import { getIscpTransferMethod } from './getIscpTransferMethod'
import { GAS_BUDGET } from '../constants'

export async function getEstimatedGasForTransferFromTransactionDetails(
    transactionDetails: NewTransactionDetails
): Promise<number> {
    const { recipient, layer2Parameters, rawAmount, asset } = (transactionDetails as NewTokenTransactionDetails) ?? {}

    if (!layer2Parameters) {
        return 0
    }

    const address = layer2Parameters
        ? layer2Parameters.networkAddress
        : recipient
        ? getAddressFromSubject(recipient)
        : ''
    const chainId = layer2Parameters.chainId

    const fallbackGas = GAS_BUDGET.toJSNumber()
    if (asset && chainId) {
        try {
            const iscpTransferMethod = getIscpTransferMethod(address, asset, chainId, rawAmount)
            if (iscpTransferMethod) {
                const gas = await iscpTransferMethod.estimateGas()
                return gas
            }
            return Promise.resolve(fallbackGas)
        } catch (error) {
            return Promise.resolve(fallbackGas)
        }
    } else {
        return fallbackGas
    }
}

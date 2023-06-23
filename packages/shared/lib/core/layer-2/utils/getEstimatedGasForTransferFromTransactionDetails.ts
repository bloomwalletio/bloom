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

    if (asset) {
        return (
            getIscpTransferMethod(address, asset, rawAmount)?.estimateGas() ?? Promise.resolve(GAS_BUDGET.toJSNumber())
        )
    } else {
        return GAS_BUDGET.toJSNumber()
    }
}

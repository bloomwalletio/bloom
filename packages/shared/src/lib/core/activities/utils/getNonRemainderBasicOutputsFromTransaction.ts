import { IWrappedOutput } from '@core/wallet/interfaces'
import { ActivityDirection } from '../enums'
import { getRecipientAddressFromOutput } from './outputs'

export function getNonRemainderBasicOutputsFromTransaction(
    wrappedOutputs: IWrappedOutput[],
    accountAddress: string,
    direction: ActivityDirection
): IWrappedOutput[] {
    return wrappedOutputs.filter((outputData) => {
        const recipientAddress = getRecipientAddressFromOutput(outputData.output)

        if (direction === ActivityDirection.Incoming || direction === ActivityDirection.SelfTransaction) {
            return accountAddress === recipientAddress
        } else {
            return accountAddress !== recipientAddress
        }
    })
}

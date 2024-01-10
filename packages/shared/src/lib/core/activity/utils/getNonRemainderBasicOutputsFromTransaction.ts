import { IAccountState } from '@core/account/interfaces'
import { getActiveNetworkId } from '@core/network/actions'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { CommonOutput } from '@iota/sdk/out/types'
import { ActivityDirection } from '../enums'
import { isAddressFromActiveAccount } from './isAddressFromActiveAccount'
import { getRecipientAddressFromOutput } from './outputs'

export function getNonRemainderBasicOutputsFromTransaction(
    wrappedOutputs: IWrappedOutput[],
    account: IAccountState,
    direction: ActivityDirection
): IWrappedOutput[] {
    if (direction === ActivityDirection.SelfTransaction) {
        return [wrappedOutputs[0]]
    }

    return wrappedOutputs.filter((outputData) => {
        const recipientAddress = getRecipientAddressFromOutput(outputData.output as CommonOutput)
        const isActiveAccount = isAddressFromActiveAccount(recipientAddress, account, getActiveNetworkId())

        if (direction === ActivityDirection.Incoming) {
            return isActiveAccount
        } else {
            return !isActiveAccount
        }
    })
}

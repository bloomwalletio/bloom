import { IAccountState } from '@core/account/interfaces'
import { getActiveNetworkId } from '@core/network/actions'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { ActivityDirection } from '../enums'
import { isOutputSubjectFromActiveAccount } from './isOutputSubjectFromActiveAccount'

export function getNonRemainderBasicOutputsFromTransaction(
    wrappedOutputs: IWrappedOutput[],
    account: IAccountState,
    direction: ActivityDirection
): IWrappedOutput[] {
    if (direction === ActivityDirection.SelfTransaction) {
        return [wrappedOutputs[0]]
    }

    return wrappedOutputs.filter((outputData) => {
        const isActiveAccount = isOutputSubjectFromActiveAccount(outputData.output, account, getActiveNetworkId())

        if (direction === ActivityDirection.Incoming) {
            return isActiveAccount
        } else {
            return !isActiveAccount
        }
    })
}

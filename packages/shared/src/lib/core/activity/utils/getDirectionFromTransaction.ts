import { CommonOutput, OutputData } from '@iota/sdk/out/types'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { ActivityDirection } from '../enums'
import { getRecipientAddressFromOutput } from './outputs'
import { EMPTY_HEX_ID } from '@core/wallet'
import { getActiveNetworkId } from '@core/network/actions'
import { IAccountState } from '@core/account/interfaces'
import { isAddressFromActiveAccount } from './isAddressFromActiveAccount'

export function getDirectionFromTransaction(
    wrappedOutputs: IWrappedOutput[],
    incoming: boolean,
    account: IAccountState,
    inputs: OutputData[]
): ActivityDirection {
    const isGenesis =
        inputs.length === 0 && wrappedOutputs.some((outputData) => outputData.metadata?.blockId === EMPTY_HEX_ID)
    if (isGenesis) {
        return ActivityDirection.Genesis
    }
    const hasOutputsFromOrToAnExternalAddress = wrappedOutputs.some((outputData) => {
        const recipientAddress = getRecipientAddressFromOutput(outputData.output as CommonOutput)
        const isActiveAccount = isAddressFromActiveAccount(recipientAddress, account, getActiveNetworkId())

        if (incoming) {
            return isActiveAccount
        } else {
            return !isActiveAccount
        }
    })
    if (hasOutputsFromOrToAnExternalAddress) {
        return incoming ? ActivityDirection.Incoming : ActivityDirection.Outgoing
    } else {
        const isSelfTransaction = wrappedOutputs.some((outputData) => {
            const recipientAddress = getRecipientAddressFromOutput(outputData.output as CommonOutput)
            return isAddressFromActiveAccount(recipientAddress, account, getActiveNetworkId())
        })
        return isSelfTransaction ? ActivityDirection.SelfTransaction : ActivityDirection.Incoming
    }
}

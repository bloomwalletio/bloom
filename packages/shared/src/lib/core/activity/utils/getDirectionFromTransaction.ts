import { OutputData } from '@iota/sdk/out/types'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { ActivityDirection } from '../enums'
import { EMPTY_HEX_ID } from '@core/wallet'
import { getActiveNetworkId } from '@core/network/actions'
import { IAccountState } from '@core/account/interfaces'
import { isOutputSubjectFromActiveAccount } from './isOutputSubjectFromActiveAccount'

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

    const networkId = getActiveNetworkId()
    const containsIncomingOutput = wrappedOutputs.some((outputData) => {
        return isOutputSubjectFromActiveAccount(outputData.output, account, networkId)
    })
    const containsOutgoingOutput = wrappedOutputs.some((outputData) => {
        return !isOutputSubjectFromActiveAccount(outputData.output, account, networkId)
    })

    if (containsIncomingOutput && incoming) {
        return ActivityDirection.Incoming
    } else if (containsOutgoingOutput && !incoming) {
        return ActivityDirection.Outgoing
    } else if (containsIncomingOutput && !incoming) {
        return ActivityDirection.SelfTransaction
    } else {
        return ActivityDirection.Incoming
    }
}

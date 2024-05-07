import { IAccountState } from '@core/account/interfaces'
import { EvmTransactionData } from '@core/layer-2/types'
import { IEvmNetwork } from '@core/network/interfaces'
import { isEvmNetwork, isStardustNetwork } from '@core/network/utils'
import { SendFlowParameters } from '../../types'
import { createEvmToEvmTransaction } from './createEvmToEvmTransaction'
import { createEvmToStardustTransaction } from './createEvmToStardustTransaction'

export async function createEvmTransactionFromSendFlowParameters(
    sendFlowParameters: SendFlowParameters,
    originEvmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<EvmTransactionData | undefined> {
    const { destinationNetworkId, sourceNetworkId } = sendFlowParameters
    if (sourceNetworkId && destinationNetworkId) {
        // L2 -> L2 transfer (same evmNetwork)
        if (isEvmNetwork(destinationNetworkId)) {
            return await createEvmToEvmTransaction(sendFlowParameters, originEvmNetwork, account)
        }
        // L2 -> L1 transfer (unwrapping)
        else if (isStardustNetwork(destinationNetworkId)) {
            return await createEvmToStardustTransaction(sendFlowParameters, originEvmNetwork, account)
        }
    } else {
        throw new Error('Invalid destination network')
    }
}

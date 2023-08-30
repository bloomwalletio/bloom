import { IAccountState } from '@core/account/interfaces'
import { EvmTransactionData } from '@core/layer-2/types'
import { IChain } from '@core/network/interfaces'
import { isEvmChain, isStardustNetwork } from '@core/network/utils'

import { SendFlowParameters } from '../../types'
import { getNetworkIdFromSendFlowParameters } from '../getNetworkIdFromSendFlowParameters'
import { createEvmChainToEvmChainTransaction } from './createEvmChainToEvmChainTransaction'
import { createEvmChainToStardustNetworkTransaction } from './createEvmChainToStardustNetworkTransaction'

export async function createEvmTransactionFromSendFlowParameters(
    sendFlowParameters: SendFlowParameters,
    originChain: IChain,
    account: IAccountState
): Promise<EvmTransactionData | undefined> {
    const originNetworkId = getNetworkIdFromSendFlowParameters(sendFlowParameters)
    const { destinationNetworkId } = sendFlowParameters
    if (originNetworkId && destinationNetworkId) {
        // L2 -> L2 transfer (same chain)
        if (isEvmChain(destinationNetworkId)) {
            return await createEvmChainToEvmChainTransaction(sendFlowParameters, originChain, account)
        }
        // L2 -> L1 transfer (unwrapping)
        else if (isStardustNetwork(destinationNetworkId)) {
            return await createEvmChainToStardustNetworkTransaction(sendFlowParameters, originChain, account)
        }
    } else {
        throw new Error('Invalid destination network')
    }
}

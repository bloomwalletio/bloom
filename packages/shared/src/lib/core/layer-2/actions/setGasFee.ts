import { IAccountState } from '@core/account/interfaces'
import { handleError } from '@core/error/handlers'
import { getGasFeeForLayer1ToLayer2Transaction } from '@core/layer-2/actions'
import { calculateMaxGasFeeFromTransactionData } from '@core/layer-2/utils'
import { isEvmChain, getNetwork } from '@core/network'
import {
    SendFlowParameters,
    getNetworkIdFromSendFlowParameters,
    createEvmTransactionFromSendFlowParameters,
    updateSendFlowParameters,
} from '@core/wallet'

export async function setGasFee(sendFlowParams: SendFlowParameters, account: IAccountState): Promise<void> {
    try {
        if (sendFlowParams.gasFee) {
            return
        }

        const sourceNetworkId = getNetworkIdFromSendFlowParameters(sendFlowParams)
        if (!sourceNetworkId || !sendFlowParams.destinationNetworkId) {
            throw new Error('Networks are not set in send flow parameters!')
        }

        let gasFee: number | undefined
        if (isEvmChain(sourceNetworkId)) {
            const chain = getNetwork()?.getChain(sourceNetworkId)
            if (!chain) {
                throw new Error('Chain is undefined!')
            }

            try {
                const txData = await createEvmTransactionFromSendFlowParameters(sendFlowParams, chain, account)
                gasFee = txData ? calculateMaxGasFeeFromTransactionData(txData) : undefined
            } catch (error) {
                console.error(error)
            }
        } else if (isEvmChain(sendFlowParams.destinationNetworkId)) {
            gasFee = await getGasFeeForLayer1ToLayer2Transaction(sendFlowParams)
        }

        updateSendFlowParameters({
            type: sendFlowParams.type,
            gasFee,
        })
    } catch (err) {
        handleError(err)
    }
}

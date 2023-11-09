import { IAccountState, prepareOutput } from '@core/account'
import { DEFAULT_TRANSACTION_OPTIONS } from '@core/wallet/constants'
import { Output, SendFlowParameters } from '@core/wallet/types'
import { getOutputParameters } from '@core/wallet/utils'

export async function createStardustOutputFromSendFlowParameters(
    sendFlowParameters: SendFlowParameters,
    account: IAccountState
): Promise<Output> {
    const outputParams = getOutputParameters(sendFlowParameters, account.depositAddress)
    const { gasFee } = sendFlowParameters
    if (gasFee) {
        outputParams.amount = (Number(outputParams.amount) + gasFee).toString()
    }
    const preparedOutput = await prepareOutput(account.index, outputParams, DEFAULT_TRANSACTION_OPTIONS)
    return preparedOutput
}

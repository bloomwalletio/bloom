import { IAccountState, prepareOutput } from '@core/account'
import { DEFAULT_TRANSACTION_OPTIONS } from '@core/wallet/constants'
import { Output, SendFlowParameters } from '@core/wallet/types'
import { getOutputParameters } from '@core/wallet/utils'

export async function createStardustOutputFromSendFlowParameters(
    sendFlowParameters: SendFlowParameters,
    account: IAccountState
): Promise<Output> {
    const outputParams = getOutputParameters(sendFlowParameters, account.depositAddress)
    const preparedOutput = await prepareOutput(account.index, outputParams, DEFAULT_TRANSACTION_OPTIONS)

    const { gasFee } = sendFlowParameters
    if (gasFee) {
        // @ts-expect-error the gas calculation overrides the read-only amount property of the SDK.
        preparedOutput.amount = (Number(preparedOutput.amount) + gasFee).toString()
    }
    return preparedOutput
}

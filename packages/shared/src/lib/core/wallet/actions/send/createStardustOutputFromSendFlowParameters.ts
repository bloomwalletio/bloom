import { IAccountState, prepareOutput } from '@core/account'
import { DEFAULT_TRANSACTION_OPTIONS } from '@core/wallet/constants'
import { Output, SendFlowParameters } from '@core/wallet/types'
import { getOutputParameters } from '@core/wallet/utils'

export async function createStardustOutputFromSendFlowParameters(
    sendFlowParameters: SendFlowParameters,
    account: IAccountState
): Promise<Output | undefined> {
    try {
        const outputParams = await getOutputParameters(sendFlowParameters, account.depositAddress)
        return prepareOutput(account.index, outputParams, DEFAULT_TRANSACTION_OPTIONS)
    } catch (error) {
        console.error(error)
    }
}

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

    // For base coin transfers we add the gas fee prior to preparing the output.
    const amountWithGasFee = addGasFeeToAmount(outputParams.amount, gasFee)
    if (sendFlowParameters.baseCoinTransfer && gasFee) {
        outputParams.amount = amountWithGasFee
    }

    const preparedOutput = await prepareOutput(account.index, outputParams, DEFAULT_TRANSACTION_OPTIONS)

    // For dust transactions, native tokens & NFT transfers
    // prepareOutput calculates the storage deposit requirements.
    const coversGasAndStorageDepositRequirements = preparedOutput.amount === amountWithGasFee
    if (!coversGasAndStorageDepositRequirements && gasFee) {
        // @ts-expect-error the gas calculation overrides the read-only amount property of the SDK.
        preparedOutput.amount = addGasFeeToAmount(preparedOutput.amount, gasFee)
    }

    return preparedOutput
}

function addGasFeeToAmount(amount: string | bigint, gasFee: bigint | undefined): string {
    return (BigInt(amount) + BigInt(gasFee ?? 0)).toString()
}

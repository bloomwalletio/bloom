import { IAccountState } from '@core/account'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { BasicOutput, OutputType } from '@iota/sdk/out/types'
import { ActivityType } from '../enums'
import { activityOutputContainsValue } from '..'
import {
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { ConsolidationActivity, IActivityGenerationParameters } from '../types'
import { NetworkId } from '@core/network/types'

export async function generateSingleConsolidationActivity(
    account: IAccountState,
    networkId: NetworkId,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<ConsolidationActivity> {
    const { transactionId, direction, claimingData, time, inclusionState, wrappedInputs } = processedTransaction

    const isHidden = false
    const isAssetHidden = false
    const containsValue = await activityOutputContainsValue(wrappedOutput)

    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const output = wrappedOutput.output as BasicOutput

    const amountConsolidatedInputs = getAmountOfConsolidationInputs(wrappedInputs)

    const tag = getTagFromOutput(output)
    const metadata = getMetadataFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, account)
    const asyncData = getAsyncDataFromOutput(output, outputId, claimingData, account)

    const storageDeposit = getStorageDepositFromOutput(output)
    return {
        type: ActivityType.Consolidation,
        isHidden,
        id,
        transactionId,
        time,
        direction,
        action,
        isAssetHidden,
        inclusionState,
        containsValue,
        outputId,
        storageDeposit,
        metadata,
        tag,
        networkId,
        asyncData,
        amountConsolidatedInputs,
        ...sendingInfo,
    }
}

function getAmountOfConsolidationInputs(inputs: IWrappedOutput[]): number {
    return inputs.filter((input) => input.output.type === OutputType.Basic).length
}

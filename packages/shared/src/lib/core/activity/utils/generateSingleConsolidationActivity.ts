import { IAccountState } from '@core/account'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { IBasicOutput } from '@iota/types'
import { ActivityType } from '../enums'
import { activityOutputContainsValue } from '..'
import {
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { OUTPUT_TYPE_BASIC } from '@core/wallet/constants'
import { ConsolidationActivity, IActivityGenerationParameters } from '../types'
import { NetworkId } from '@core/network/types'

export function generateSingleConsolidationActivity(
    account: IAccountState,
    networkId: NetworkId,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): ConsolidationActivity {
    const { transactionId, direction, claimingData, time, inclusionState, wrappedInputs } = processedTransaction

    const isHidden = false
    const isAssetHidden = false
    const containsValue = activityOutputContainsValue(wrappedOutput)

    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const output = wrappedOutput.output as IBasicOutput

    const amountConsolidatedInputs = getAmountOfConsolidationInputs(wrappedInputs)

    const tag = getTagFromOutput(output)
    const metadata = getMetadataFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, account, networkId)
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
    return inputs.filter((input) => input.output.type === OUTPUT_TYPE_BASIC).length
}

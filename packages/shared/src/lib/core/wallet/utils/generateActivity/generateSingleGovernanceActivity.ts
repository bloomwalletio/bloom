import { IAccountState } from '@core/account'
import { IActivityGenerationParameters } from '@core/wallet/interfaces'
import { GovernanceActivity } from '@core/wallet/types'
import type { BasicOutput } from '@iota/sdk'
import { ActivityType } from '../../enums'
import { activityOutputContainsValue } from '..'
import {
    getGovernanceInfo,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'

export function generateSingleGovernanceActivity(
    account: IAccountState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): GovernanceActivity {
    const { transactionId, direction, time, inclusionState, wrappedInputs } = processedTransaction

    const isHidden = false
    const isAssetHidden = false
    const containsValue = activityOutputContainsValue(wrappedOutput)

    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const output = wrappedOutput.output as BasicOutput

    const tag = getTagFromOutput(output)
    const metadata = getMetadataFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, account)

    const storageDeposit = getStorageDepositFromOutput(output)
    const governanceInfo = getGovernanceInfo(output, wrappedInputs, metadata)

    return {
        type: ActivityType.Governance,
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
        asyncData: null,
        ...governanceInfo,
        ...sendingInfo,
    }
}

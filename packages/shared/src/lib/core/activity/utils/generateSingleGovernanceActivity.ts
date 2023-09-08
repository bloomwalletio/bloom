import { IAccountState } from '@core/account'
import type { BasicOutput } from '@iota/sdk/out/types'
import {} from '../types'
import { GovernanceActivity, IActivityGenerationParameters } from '../types'
import { ActivityType } from '../enums'
import { activityOutputContainsValue } from '..'
import {
    getGovernanceInfo,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { NetworkId } from '@core/network/types'

export async function generateSingleGovernanceActivity(
    account: IAccountState,
    networkId: NetworkId,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<GovernanceActivity> {
    const { transactionId, direction, time, inclusionState, wrappedInputs } = processedTransaction

    const isHidden = false
    const isAssetHidden = false
    const containsValue = await activityOutputContainsValue(wrappedOutput)

    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const output = wrappedOutput.output as BasicOutput

    const tag = getTagFromOutput(output)
    const metadata = getMetadataFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, account, networkId)

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
        sourceNetworkId: networkId,
        destinationNetworkId: networkId,
        asyncData: undefined,
        ...governanceInfo,
        ...sendingInfo,
    }
}

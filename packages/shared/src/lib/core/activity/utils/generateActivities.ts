import { OutputType } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account'
import { Activity, IProcessedTransaction } from '../types'
import { isParticipationOutput } from '@contexts/governance/utils'
import { NetworkId } from '@core/network/types'
import { ActivityAction, ActivityType } from '../enums'
import { generateActivitiesFromAliasOutputs } from './generateActivitiesFromAliasOutputs'
import { generateActivitiesFromBasicOutputs } from './generateActivitiesFromBasicOutputs'
import { generateActivitiesFromFoundryOutputs } from './generateActivitiesFromFoundryOutputs'
import { generateActivitiesFromNftOutputs } from './generateActivitiesFromNftOutputs'
import { generateSingleAliasActivity } from './generateSingleAliasActivity'
import { generateSingleBasicActivity } from './generateSingleBasicActivity'
import { generateSingleFoundryActivity } from './generateSingleFoundryActivity'
import { generateSingleGovernanceActivity } from './generateSingleGovernanceActivity'
import { generateSingleNftActivity } from './generateSingleNftActivity'
import { getActivityTypeFromOutput } from './helper'

export async function generateActivities(
    processedTransaction: IProcessedTransaction,
    account: IAccountState,
    networkId: NetworkId
): Promise<Activity[]> {
    if (processedTransaction.wrappedInputs?.length > 0) {
        return generateActivitiesFromProcessedTransactionsWithInputs(processedTransaction, account, networkId)
    } else {
        return generateActivitiesFromProcessedTransactionsWithoutInputs(processedTransaction, account, networkId)
    }
}

async function generateActivitiesFromProcessedTransactionsWithInputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState,
    networkId: NetworkId
): Promise<Activity[]> {
    const { outputs, wrappedInputs } = processedTransaction
    const activities: Activity[] = []

    const containsFoundryActivity = outputs.some((output) => output.output.type === OutputType.Foundry)
    if (containsFoundryActivity) {
        const foundryActivities = await generateActivitiesFromFoundryOutputs(processedTransaction, account, networkId)
        activities.push(...foundryActivities)
    }

    const containsNftActivity = outputs.some((output) => output.output.type === OutputType.Nft)
    if (containsNftActivity) {
        const nftActivities = await generateActivitiesFromNftOutputs(processedTransaction, account, networkId)
        activities.push(...nftActivities)
    }

    const containsAliasActivity =
        outputs.some((output) => output.output.type === OutputType.Alias) && !containsFoundryActivity
    if (containsAliasActivity) {
        const aliasActivities = await generateActivitiesFromAliasOutputs(processedTransaction, account, networkId)
        activities.push(...aliasActivities)
    }

    const hasParticipationInputs = wrappedInputs?.some((input) => isParticipationOutput(input.output))
    const governanceOutput = hasParticipationInputs
        ? processedTransaction?.outputs[0]
        : outputs.find((output) => isParticipationOutput(output.output))
    if (governanceOutput) {
        const governanceActivity = await generateSingleGovernanceActivity(account, networkId, {
            processedTransaction,
            wrappedOutput: governanceOutput,
            action: ActivityAction.Unknown,
        })
        activities.push(governanceActivity)
    }

    if (!containsFoundryActivity && !containsNftActivity && !containsAliasActivity && !governanceOutput) {
        const basicActivities = await generateActivitiesFromBasicOutputs(processedTransaction, account, networkId)
        activities.push(...basicActivities)
    }

    return activities
}

/*
 * If we cannot get the detailed inputs for a transaction, we would need to blind guess what the user did with the transaction.
 * Therefore we set the action to `Unknown`
 */
async function generateActivitiesFromProcessedTransactionsWithoutInputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState,
    networkId: NetworkId
): Promise<Activity[]> {
    const nonRemainderOutputs = processedTransaction.outputs.filter((wrappedOutput) => !wrappedOutput.remainder)
    const activities = await Promise.all(
        nonRemainderOutputs.map(async (wrappedOutput) => {
            const params = {
                type: getActivityTypeFromOutput(wrappedOutput),
                action: ActivityAction.Unknown,
                processedTransaction,
                wrappedOutput,
            }
            switch (params.type) {
                case ActivityType.Basic:
                    return generateSingleBasicActivity(account, networkId, params)
                case ActivityType.Governance:
                    return generateSingleGovernanceActivity(account, networkId, params)
                case ActivityType.Foundry:
                    return generateSingleFoundryActivity(account, networkId, params)
                case ActivityType.Alias:
                    return generateSingleAliasActivity(account, networkId, params)
                case ActivityType.Nft:
                    return generateSingleNftActivity(account, networkId, params)
                default:
                    return Promise.resolve()
            }
        })
    )
    return activities.filter((_activity) => _activity) as Activity[]
}

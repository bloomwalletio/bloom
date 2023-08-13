import { IAccountState } from '@core/account'
import { OUTPUT_TYPE_ALIAS, OUTPUT_TYPE_FOUNDRY, OUTPUT_TYPE_NFT } from '@core/wallet'
import { Activity, IProcessedTransaction } from '../types'
import { isParticipationOutput } from '@contexts/governance/utils'
import { generateSingleAliasActivity } from './generateSingleAliasActivity'
import { generateSingleFoundryActivity } from './generateSingleFoundryActivity'
import { generateSingleGovernanceActivity } from './generateSingleGovernanceActivity'
import { generateSingleNftActivity } from './generateSingleNftActivity'
import { generateSingleBasicActivity } from './generateSingleBasicActivity'
import { getActivityTypeFromOutput } from './helper'
import { generateActivitiesFromNftOutputs } from './generateActivitiesFromNftOutputs'
import { generateActivitiesFromAliasOutputs } from './generateActivitiesFromAliasOutputs'
import { generateActivitiesFromFoundryOutputs } from './generateActivitiesFromFoundryOutputs'
import { generateActivitiesFromBasicOutputs } from './generateActivitiesFromBasicOutputs'
import { ActivityAction, ActivityType } from '../enums'
import { NetworkId } from '@core/network/types'

export function generateActivities(
    processedTransaction: IProcessedTransaction,
    account: IAccountState,
    networkId: NetworkId
): Activity[] {
    if (processedTransaction.wrappedInputs?.length > 0) {
        return generateActivitiesFromProcessedTransactionsWithInputs(processedTransaction, account, networkId)
    } else {
        return generateActivitiesFromProcessedTransactionsWithoutInputs(processedTransaction, account, networkId)
    }
}

function generateActivitiesFromProcessedTransactionsWithInputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState,
    networkId: NetworkId
): Activity[] {
    const { outputs, wrappedInputs } = processedTransaction
    const activities: Activity[] = []

    const containsFoundryActivity = outputs.some((output) => output.output.type === OUTPUT_TYPE_FOUNDRY)
    if (containsFoundryActivity) {
        const foundryActivities = generateActivitiesFromFoundryOutputs(processedTransaction, account, networkId)
        activities.push(...foundryActivities)
    }

    const containsNftActivity = outputs.some((output) => output.output.type === OUTPUT_TYPE_NFT)
    if (containsNftActivity) {
        const nftActivities = generateActivitiesFromNftOutputs(processedTransaction, account, networkId)
        activities.push(...nftActivities)
    }

    const containsAliasActivity =
        outputs.some((output) => output.output.type === OUTPUT_TYPE_ALIAS) && !containsFoundryActivity
    if (containsAliasActivity) {
        const aliasActivities = generateActivitiesFromAliasOutputs(processedTransaction, account, networkId)
        activities.push(...aliasActivities)
    }

    const hasParticipationInputs = wrappedInputs?.some((input) => isParticipationOutput(input.output))
    const governanceOutput = hasParticipationInputs
        ? processedTransaction?.outputs[0]
        : outputs.find((output) => isParticipationOutput(output.output))
    if (governanceOutput) {
        const governanceActivity = generateSingleGovernanceActivity(account, networkId, {
            processedTransaction,
            wrappedOutput: governanceOutput,
            action: null,
        })
        activities.push(governanceActivity)
    }

    if (!containsFoundryActivity && !containsNftActivity && !containsAliasActivity && !governanceOutput) {
        const basicActivities = generateActivitiesFromBasicOutputs(processedTransaction, account, networkId)
        activities.push(...basicActivities)
    }

    return activities
}

/*
 * If we cannot get the detailed inputs for a transaction, we would need to blind guess what the user did with the transaction.
 * Therefore we set the action to `Unknown`
 */
function generateActivitiesFromProcessedTransactionsWithoutInputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState,
    networkId: NetworkId
): Activity[] {
    const nonRemainderOutputs = processedTransaction.outputs.filter((wrappedOutput) => !wrappedOutput.remainder)
    return nonRemainderOutputs.map((wrappedOutput) => {
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
        }
    })
}

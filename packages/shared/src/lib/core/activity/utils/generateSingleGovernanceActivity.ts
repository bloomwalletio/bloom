import type { BasicOutput } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account'
import {} from '../types'
import { NetworkId } from '@core/network/types'
import { ActivityType } from '../enums'
import { GovernanceActivity, IActivityGenerationParameters } from '../types'
import { generateBaseActivity } from './generateBaseActivity'
import { getGovernanceInfo } from './helper'

export async function generateSingleGovernanceActivity(
    account: IAccountState,
    networkId: NetworkId,
    generationParameters: IActivityGenerationParameters
): Promise<GovernanceActivity> {
    const baseActivity = await generateBaseActivity(account, networkId, generationParameters)

    const output = generationParameters.wrappedOutput.output as BasicOutput
    const governanceInfo = getGovernanceInfo(
        output,
        generationParameters.processedTransaction.wrappedInputs,
        baseActivity.metadata ?? ''
    )

    return {
        ...baseActivity,
        type: ActivityType.Governance,
        ...governanceInfo,
    }
}

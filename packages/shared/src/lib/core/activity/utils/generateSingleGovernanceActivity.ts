import { IAccountState } from '@core/account'
import { IActivityGenerationParameters } from '@core/activity/types'
import { NetworkId } from '@core/network/types'
import { ActivityType } from '../enums'
import { GovernanceActivity } from '../types'
import { generateBaseActivity } from './generateBaseActivity'
import { getGovernanceInfo } from './helper'
import { IBasicOutput } from '@iota/types'

export function generateSingleGovernanceActivity(
    account: IAccountState,
    networkId: NetworkId,
    generationParameters: IActivityGenerationParameters
): GovernanceActivity {
    const baseActivity = generateBaseActivity(account, networkId, generationParameters)

    const output = generationParameters.wrappedOutput.output as IBasicOutput
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

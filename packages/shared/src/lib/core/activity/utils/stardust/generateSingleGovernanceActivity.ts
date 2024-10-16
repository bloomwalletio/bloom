import { IAccountState } from '@core/account'
import type { BasicOutput } from '@iota/sdk/out/types'
import {} from '../../types'
import { StardustGovernanceActivity, IActivityGenerationParameters } from '../../types'
import { StardustActivityType } from '../../enums'
import { StardustNetworkId } from '@core/network/types'
import { generateBaseActivity } from './generateBaseActivity'
import { getGovernanceInfo } from '../helper'

export async function generateSingleGovernanceActivity(
    account: IAccountState,
    networkId: StardustNetworkId,
    generationParameters: IActivityGenerationParameters
): Promise<StardustGovernanceActivity> {
    const baseActivity = await generateBaseActivity(account, networkId, generationParameters)

    const output = generationParameters.wrappedOutput.output as BasicOutput
    const governanceInfo = getGovernanceInfo(
        output,
        generationParameters.processedTransaction.wrappedInputs,
        baseActivity.metadata ?? ''
    )

    return {
        ...baseActivity,
        type: StardustActivityType.Governance,
        ...governanceInfo,
    }
}

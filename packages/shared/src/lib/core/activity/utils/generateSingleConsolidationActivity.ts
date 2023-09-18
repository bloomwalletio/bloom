import { OutputType } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account'
import { NetworkId } from '@core/network/types'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { ActivityType } from '../enums'
import { ConsolidationActivity, IActivityGenerationParameters } from '../types'
import { generateBaseActivity } from './generateBaseActivity'

export async function generateSingleConsolidationActivity(
    account: IAccountState,
    networkId: NetworkId,
    generationParameters: IActivityGenerationParameters
): Promise<ConsolidationActivity> {
    const baseActivity = await generateBaseActivity(account, networkId, generationParameters)
    const amountConsolidatedInputs = getAmountOfConsolidationInputs(
        generationParameters.processedTransaction.wrappedInputs
    )

    return {
        type: ActivityType.Consolidation,
        ...baseActivity,
        amountConsolidatedInputs,
    }
}

function getAmountOfConsolidationInputs(inputs: IWrappedOutput[]): number {
    return inputs.filter((input) => input.output?.type === OutputType.Basic).length
}

import { IAccountState } from '@core/account'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { OutputType } from '@iota/sdk/out/types'
import { StardustActivityType } from '../../enums'
import { StardustConsolidationActivity, IActivityGenerationParameters } from '../../types'
import { StardustNetworkId } from '@core/network/types'
import { generateBaseActivity } from './generateBaseActivity'

export async function generateSingleConsolidationActivity(
    account: IAccountState,
    networkId: StardustNetworkId,
    generationParameters: IActivityGenerationParameters
): Promise<StardustConsolidationActivity> {
    const baseActivity = await generateBaseActivity(account, networkId, generationParameters)
    const amountConsolidatedInputs = getAmountOfConsolidationInputs(
        generationParameters.processedTransaction.wrappedInputs
    )

    return {
        type: StardustActivityType.Consolidation,
        ...baseActivity,
        amountConsolidatedInputs,
    }
}

function getAmountOfConsolidationInputs(inputs: IWrappedOutput[]): number {
    return inputs.filter((input) => input.output?.type === OutputType.Basic).length
}

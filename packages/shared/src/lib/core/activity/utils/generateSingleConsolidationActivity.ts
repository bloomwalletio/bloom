import { IAccountState } from '@core/account'
import { NetworkId } from '@core/network/types'
import { OUTPUT_TYPE_BASIC } from '@core/wallet/constants'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { ActivityType } from '../enums'
import { ConsolidationActivity, IActivityGenerationParameters } from '../types'
import { generateBaseActivity } from './generateBaseActivity'

export function generateSingleConsolidationActivity(
    account: IAccountState,
    networkId: NetworkId,
    generationParameters: IActivityGenerationParameters
): ConsolidationActivity {
    const baseActivity = generateBaseActivity(account, networkId, generationParameters)
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
    return inputs.filter((input) => input.output.type === OUTPUT_TYPE_BASIC).length
}

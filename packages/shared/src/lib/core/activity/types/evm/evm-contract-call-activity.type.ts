import { EvmActivityType } from '@core/activity/enums/evm'
import { BaseEvmActivity } from './base-evm-activity.type'
import { IParsedInput } from '@core/layer-2'

export type EvmContractCallActivity = BaseEvmActivity & {
    type: EvmActivityType.ContractCall
    rawData: string

    methodId?: string
    method?: string
    inputs?: IParsedInput[]
}

import { EvmActivityType } from '@core/activity/enums/evm'
import { BaseEvmActivity } from './base-evm-activity.type'

export type EvmContractCallActivity = BaseEvmActivity & {
    type: EvmActivityType.ContractCall
    verified: boolean
    rawData: string

    methodId?: string
    method?: string
    parameters?: Record<string, string>
}

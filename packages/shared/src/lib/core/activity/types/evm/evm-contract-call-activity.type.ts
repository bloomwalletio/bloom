import { EvmActivityType } from '@core/activity/enums/evm'
import { BaseEvmActivity } from './base-evm-activity.type'

export type EvmContractCallActivity = BaseEvmActivity & {
    type: EvmActivityType.ContractCall

    method: string
    inputs: string[]
    rawData: string
}

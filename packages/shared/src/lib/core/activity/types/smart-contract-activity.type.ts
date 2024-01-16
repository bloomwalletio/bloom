import { ActivityType } from '../enums'
import { BaseActivity } from './base-activity.type'

export type SmartContractActivity = BaseActivity & {
    type: ActivityType.SmartContract
    methodName: string
    data: string
}

import { ActivityType } from '../../enums'
import { BaseStardustActivity } from './base-stardust-activity.type'

export type SmartContractActivity = BaseStardustActivity & {
    type: ActivityType.SmartContract
    methodName: string
    data: string
}

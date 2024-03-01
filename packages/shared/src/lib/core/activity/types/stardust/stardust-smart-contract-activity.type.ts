import { StardustActivityType } from '../../enums'
import { BaseStardustActivity } from './base-stardust-activity.type'

export type StardustSmartContractActivity = BaseStardustActivity & {
    type: StardustActivityType.SmartContract
    methodName: string
    data: string
}

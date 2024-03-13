import { StardustActivityType } from '../../enums'
import { BaseStardustActivity } from './base-stardust-activity.type'

export type StardustAliasActivity = BaseStardustActivity & {
    type: StardustActivityType.Alias
    aliasId: string
    governorAddress: string
    stateControllerAddress: string
}

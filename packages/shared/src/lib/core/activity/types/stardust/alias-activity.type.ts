import { ActivityType } from '../../enums'
import { BaseStardustActivity } from './base-stardust-activity.type'

export type AliasActivity = BaseStardustActivity & {
    type: ActivityType.Alias
    aliasId: string
    governorAddress: string
    stateControllerAddress: string
}

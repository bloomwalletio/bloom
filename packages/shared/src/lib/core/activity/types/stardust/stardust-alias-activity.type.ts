import { ActivityType } from '../../enums'
import { BaseStardustActivity } from './base-stardust-activity.type'

export type StardustAliasActivity = BaseStardustActivity & {
    type: ActivityType.Alias
    aliasId: string
    governorAddress: string
    stateControllerAddress: string
}

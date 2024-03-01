import { ActivityType } from '../../enums'
import { BaseStardustActivity } from './base-stardust-activity.type'

// TODO: basic activity type
export type TransactionActivity = BaseStardustActivity & {
    type: ActivityType.Basic
    isShimmerClaiming?: boolean
}

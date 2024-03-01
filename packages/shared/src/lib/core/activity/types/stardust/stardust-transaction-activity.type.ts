import { StardustActivityType } from '../../enums'
import { BaseStardustActivity } from './base-stardust-activity.type'

// TODO: basic activity type
export type StardustTransactionActivity = BaseStardustActivity & {
    type: StardustActivityType.Basic
    isShimmerClaiming?: boolean
}

import { ActivityType } from '../enums'
import { BaseActivity } from './base-activity.type'

// TODO: basic activity type
export type TransactionActivity = BaseActivity & {
    type: ActivityType.Basic
    isShimmerClaiming?: boolean
}

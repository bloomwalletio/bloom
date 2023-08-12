import { ActivityType } from '../enums'
import { BaseActivity } from './base-activity.type'

export type TransactionActivity = BaseActivity & {
    type: ActivityType.Basic
    rawAmount: number
    tokenId: string
    publicNote?: string
    isShimmerClaiming?: boolean
}

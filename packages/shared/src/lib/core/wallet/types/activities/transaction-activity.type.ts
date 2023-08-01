import { ActivityType } from '@core/wallet/enums'
import { BaseActivity } from './base-activity.type'

export type TransactionActivity = BaseActivity & {
    type: ActivityType.Basic
    rawAmount: number
    assetId: string
    chainId: number | undefined
    publicNote?: string
    isShimmerClaiming?: boolean
}

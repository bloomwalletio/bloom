import { ActivityType } from '../enums'
import { BaseActivity } from './base-activity.type'

export type ConsolidationActivity = BaseActivity & {
    type: ActivityType.Consolidation
    amountConsolidatedInputs: number
}

import { ActivityType } from '../../enums'
import { BaseStardustActivity } from './base-stardust-activity.type'

export type StardustConsolidationActivity = BaseStardustActivity & {
    type: ActivityType.Consolidation
    amountConsolidatedInputs: number
}

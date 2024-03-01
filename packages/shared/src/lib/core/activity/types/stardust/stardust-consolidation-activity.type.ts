import { StardustActivityType } from '../../enums'
import { BaseStardustActivity } from './base-stardust-activity.type'

export type StardustConsolidationActivity = BaseStardustActivity & {
    type: StardustActivityType.Consolidation
    amountConsolidatedInputs: number
}

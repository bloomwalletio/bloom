import { StardustActivityType } from '../../enums'
import { BaseStardustActivity } from './base-stardust-activity.type'

export type StardustNftActivity = BaseStardustActivity & {
    type: StardustActivityType.Nft
    nftId: string
}

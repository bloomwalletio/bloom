import { ActivityType } from '../../enums'
import { BaseStardustActivity } from './base-stardust-activity.type'

export type StardustNftActivity = BaseStardustActivity & {
    type: ActivityType.Nft
    nftId: string
}

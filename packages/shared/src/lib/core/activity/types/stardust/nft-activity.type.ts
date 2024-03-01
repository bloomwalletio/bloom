import { ActivityType } from '../../enums'
import { BaseStardustActivity } from './base-stardust-activity.type'

export type NftActivity = BaseStardustActivity & {
    type: ActivityType.Nft
    nftId: string
}

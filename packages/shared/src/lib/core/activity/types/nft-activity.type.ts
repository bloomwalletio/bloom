import { ActivityType } from '../enums'
import { BaseActivity } from './base-activity.type'

export type NftActivity = BaseActivity & {
    type: ActivityType.Nft
    nftId: string
    networkId: string
}

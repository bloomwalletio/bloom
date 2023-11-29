import { ActivityType } from '../enums'
import { BaseActivity } from './base-activity.type'

export type FoundryActivity = BaseActivity & {
    type: ActivityType.Foundry
    aliasAddress: string
    mintedTokens: string
    meltedTokens: string
    maximumSupply: string
}

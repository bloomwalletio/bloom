import { ActivityType } from '../enums'
import { BaseActivity } from './base-activity.type'

export type FoundryActivity = BaseActivity & {
    type: ActivityType.Foundry
    aliasAddress: string
    mintedTokens: bigint
    meltedTokens: bigint
    maximumSupply: bigint
}

import { ActivityType } from '../../enums'
import { BaseStardustActivity } from './base-stardust-activity.type'

export type StardustFoundryActivity = BaseStardustActivity & {
    type: ActivityType.Foundry
    aliasAddress: string
    mintedTokens: bigint
    meltedTokens: bigint
    maximumSupply: bigint
}

import { StardustActivityType } from '../../enums'
import { BaseStardustActivity } from './base-stardust-activity.type'

export type StardustFoundryActivity = BaseStardustActivity & {
    type: StardustActivityType.Foundry
    aliasAddress: string
    mintedTokens: bigint
    meltedTokens: bigint
    maximumSupply: bigint
}

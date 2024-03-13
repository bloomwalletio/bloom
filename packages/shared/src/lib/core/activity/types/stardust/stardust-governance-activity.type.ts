import { StardustActivityType, StardustGovernanceAction } from '../../enums'
import { IParticipation } from '@core/wallet/interfaces'
import { BaseStardustActivity } from './base-stardust-activity.type'

export type StardustGovernanceActivity = BaseStardustActivity & {
    type: StardustActivityType.Governance
    governanceAction: StardustGovernanceAction
    votingPower: bigint
    participation?: IParticipation
    votingPowerDifference?: bigint
}

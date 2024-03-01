import { ActivityType, GovernanceAction } from '../../enums'
import { IParticipation } from '@core/wallet/interfaces'
import { BaseStardustActivity } from './base-stardust-activity.type'

export type StardustGovernanceActivity = BaseStardustActivity & {
    type: ActivityType.Governance
    governanceAction: GovernanceAction
    votingPower: bigint
    participation?: IParticipation
    votingPowerDifference?: bigint
}

import { ActivityType, GovernanceAction } from '../enums'
import { IParticipation } from '@core/wallet/interfaces'
import { BaseActivity } from './base-activity.type'

export type GovernanceActivity = BaseActivity & {
    type: ActivityType.Governance
    governanceAction: GovernanceAction
    votingPower: bigint
    participation?: IParticipation
    votingPowerDifference?: bigint
}

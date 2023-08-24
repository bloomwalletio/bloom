import { ActivityType, GovernanceAction } from '../enums'
import { IParticipation } from '@core/wallet/interfaces'
import { BaseActivity } from './base-activity.type'

export type GovernanceActivity = BaseActivity & {
    type: ActivityType.Governance
    governanceAction: GovernanceAction
    votingPower: number
    participation?: IParticipation
    votingPowerDifference?: number
}

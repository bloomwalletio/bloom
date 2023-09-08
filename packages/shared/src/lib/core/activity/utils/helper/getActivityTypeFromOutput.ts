import { OutputType } from '@iota/sdk/out/types'
import { isParticipationOutput } from '@contexts/governance/utils'
import { ActivityType } from '../../enums'
import { IWrappedOutput } from '@core/wallet/interfaces'

export function getActivityTypeFromOutput(output: IWrappedOutput): ActivityType | undefined {
    switch (output.output.type) {
        case OutputType.Nft:
            return ActivityType.Nft
        case OutputType.Alias:
            return ActivityType.Alias
        case OutputType.Foundry:
            return ActivityType.Foundry
        case OutputType.Basic:
            if (isParticipationOutput(output.output)) {
                return ActivityType.Governance
            } else {
                return ActivityType.Basic
            }
    }
}

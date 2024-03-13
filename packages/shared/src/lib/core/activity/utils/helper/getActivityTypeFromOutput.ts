import { OutputType } from '@iota/sdk/out/types'
import { isParticipationOutput } from '@contexts/governance/utils'
import { StardustActivityType } from '../../enums'
import { IWrappedOutput } from '@core/wallet/interfaces'

export function getActivityTypeFromOutput(output: IWrappedOutput): StardustActivityType | undefined {
    switch (output.output.type) {
        case OutputType.Nft:
            return StardustActivityType.Nft
        case OutputType.Alias:
            return StardustActivityType.Alias
        case OutputType.Foundry:
            return StardustActivityType.Foundry
        case OutputType.Basic:
            if (isParticipationOutput(output.output)) {
                return StardustActivityType.Governance
            } else {
                return StardustActivityType.Basic
            }
    }
}

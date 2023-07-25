import type { ParticipationEventId } from '@iota/sdk'
import { IEvmAddresses } from '@core/network/interfaces'

export interface IPersistedAccountData {
    name: string
    color: string
    hidden: boolean
    shouldRevote: boolean
    removedProposalIds?: ParticipationEventId[]
    evmAddresses: IEvmAddresses
    depositAddress: string
}

import { EventStatus } from '@iota/sdk/out/types/wallet'

export type ProposalPhaseOrdering = {
    [key in EventStatus]: number
}

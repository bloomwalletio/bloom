import { EventStatus } from '@iota/sdk/out/types'

export type ProposalPhaseOrdering = {
    [key in EventStatus]: number
}

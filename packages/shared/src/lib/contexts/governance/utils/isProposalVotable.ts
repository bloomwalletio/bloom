import { EventStatus } from '@iota/sdk/out/types/wallet'

export function isProposalVotable(status: EventStatus): boolean {
    switch (status) {
        case EventStatus.Commencing:
        case EventStatus.Holding:
            return true
        case EventStatus.Upcoming:
        case EventStatus.Ended:
        default:
            return false
    }
}

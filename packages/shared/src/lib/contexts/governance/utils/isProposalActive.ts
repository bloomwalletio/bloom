import { EventStatus } from '@iota/sdk/out/types/wallet'

export function isProposalActive(status: EventStatus): boolean {
    switch (status) {
        case EventStatus.Holding:
            return true
        case EventStatus.Commencing:
        case EventStatus.Upcoming:
        case EventStatus.Ended:
            return false
    }
}

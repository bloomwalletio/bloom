import { EventStatus } from '@iota/sdk/out/types'

export function getNextProposalPhase(status: EventStatus): EventStatus {
    switch (status) {
        case EventStatus.Upcoming:
            return EventStatus.Commencing
        case EventStatus.Commencing:
            return EventStatus.Holding
        case EventStatus.Holding:
        case EventStatus.Ended:
            return EventStatus.Ended
    }
}

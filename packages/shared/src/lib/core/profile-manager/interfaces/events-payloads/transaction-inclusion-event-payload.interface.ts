import { InclusionState } from '@core/activity'

export interface ITransactionInclusionEventPayload {
    transactionId: string
    inclusionState: InclusionState
}

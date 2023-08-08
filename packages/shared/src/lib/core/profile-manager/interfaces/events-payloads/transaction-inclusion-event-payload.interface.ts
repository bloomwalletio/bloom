import { InclusionState } from '@core/activities'

export interface ITransactionInclusionEventPayload {
    transactionId: string
    inclusionState: InclusionState
}

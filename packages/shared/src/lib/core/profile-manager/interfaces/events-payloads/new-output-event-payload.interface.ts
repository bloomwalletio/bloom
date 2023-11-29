import type { IOutputsResponse, TransactionPayload, OutputData } from '@iota/sdk'

export interface INewOutputEventPayload {
    output: OutputData
    transaction: TransactionPayload
    transactionInputs: IOutputsResponse[]
}

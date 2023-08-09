import { IWrappedOutput } from '@core/wallet/interfaces'
import { ActivityAction } from '../enums'
import { IProcessedTransaction } from './processed-transaction.interface'

export interface IActivityGenerationParameters {
    action: ActivityAction
    processedTransaction: IProcessedTransaction
    wrappedOutput: IWrappedOutput
}

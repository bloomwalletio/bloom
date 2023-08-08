import { IProcessedTransaction, IWrappedOutput } from '@core/wallet/interfaces'
import { ActivityAction } from '../enums'

export interface IActivityGenerationParameters {
    action: ActivityAction
    processedTransaction: IProcessedTransaction
    wrappedOutput: IWrappedOutput
}

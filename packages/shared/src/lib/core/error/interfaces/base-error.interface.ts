import { ErrorType } from '../enums'

export interface IBaseError {
    type: ErrorType
    error: unknown
    message: string
    cause?: unknown
    localizationKey?: string
    timestamp?: number
}

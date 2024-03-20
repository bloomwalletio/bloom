import { persistent } from '@core/utils/store'
import { IBaseError } from '../interfaces'

/**
 * Holds data about errors that have occurred.
 */
export const errorLog = persistent<IBaseError[]>('errorLog', [])

/**
 * Adds an error to the error log store.
 */
export function addError(error: IBaseError): void {
    errorLog.update((state) => [error, ...state])
}

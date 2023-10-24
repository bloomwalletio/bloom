import { showNotification } from '@auxiliary/notification/actions'
import { ErrorType } from '../enums'
import { IBaseError } from '../interfaces'
import { addError } from '../stores'

/**
 * The base error, containing logic for handling the different
 * error parameters.
 */
export class BaseError extends Error implements IBaseError {
    type: ErrorType
    error: unknown
    message: string
    cause?: unknown
    timestamp?: number
    localizationKey?: string

    constructor(err: IBaseError) {
        super(err.message, { cause: err.cause })
        this.type = err.type
        this.error = err.error
        this.message = err.message
        this.cause = err.cause
        this.timestamp = err.timestamp ?? Date.now()
        this.localizationKey = err.localizationKey
    }

    log(): void {
        console.error(this)
    }

    save(): void {
        addError({ ...this, time: this.timestamp })
    }

    notify(): void {
        showNotification({
            variant: 'error',
            text: this.message,
        })
    }
}

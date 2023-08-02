import { showAppNotification } from '@auxiliary/notification'
import { localize } from '@core/i18n'
import { ErrorType } from '../enums'
import { addError } from '../stores'

/**
 * The base error, containing logic for handling the different
 * error parameters.
 */

interface IError {
    type: ErrorType
    message: string
    timestamp: number
    cause?: string
    /**
     * CAUTION: This is important so that we can display past errors in the
     * appropriate locale if the language setting is changed.
     */
    localizationKey?: string
}

export interface IErrorOptions {
    logToConsole?: boolean
    saveToErrorLog?: boolean
    showNotification?: boolean
}

export class CustomError extends Error implements IError {
    public readonly type: ErrorType
    public readonly message: string
    public readonly timestamp: number
    public readonly cause?: string
    public readonly localizationKey?: string

    constructor(error: IError) {
        super(error.message)
        this.type = error.type
        this.message = error.message
        this.timestamp = error.timestamp
        this.cause = error.cause
        this.localizationKey = error.localizationKey
    }

    public static new(parameters: Partial<IError>, options: IErrorOptions = DEFAULT_ERROR_OPTIONS): CustomError {
        const error: IError = {
            type: parameters?.type ?? ErrorType.BaseError,
            message: parameters.message
                ? parameters.message
                : parameters?.localizationKey
                ? localize(parameters.localizationKey)
                : localize('error.global.generic'),
            timestamp: Date.now(),
            cause: parameters?.cause,
        }

        const customError = new CustomError(error)

        if (options?.logToConsole) {
            customError.logToConsole()
        }

        if (options?.saveToErrorLog) {
            customError.saveToErrorLog()
        }

        if (options?.showNotification) {
            customError.showNotification()
        }

        return customError
    }

    public saveToErrorLog(): void {
        addError({ type: this.type, message: this.message, cause: this.cause, time: this.timestamp })
    }

    public logToConsole(): void {
        console.error(this.cause)
    }

    public showNotification(): void {
        showAppNotification({
            type: 'error',
            message: this.message,
            alert: true,
        })
    }
}

const DEFAULT_ERROR_OPTIONS: IErrorOptions = {
    logToConsole: true,
    saveToErrorLog: true,
}

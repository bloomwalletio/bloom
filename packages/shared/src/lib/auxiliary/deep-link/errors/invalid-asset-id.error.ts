import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class InvalidTokenIdError extends BaseError {
    constructor() {
        const message = localize('error.send.invalidTokenId')
        super({
            message,
            showNotification: true,
            saveToErrorLog: false,
            logToConsole: true,
        })
    }
}

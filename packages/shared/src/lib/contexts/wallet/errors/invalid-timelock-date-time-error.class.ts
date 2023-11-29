import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class InvalidTimelockDateTimeError extends BaseError {
    constructor() {
        super({
            message: localize('error.send.invalidTimelockDateTime'),
            logToConsole: false,
        })
    }
}

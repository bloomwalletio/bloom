import { BaseError } from '@core/error/classes/base-error.class'
import { DEFAULT_APP_ERROR_PARAMETERS } from '@core/error/constants'

export class WalletApiEventError extends BaseError {
    constructor(error: Error) {
        super({
            message: error.message,
            ...DEFAULT_APP_ERROR_PARAMETERS,
            localizeMessage: false,
        })
    }
}

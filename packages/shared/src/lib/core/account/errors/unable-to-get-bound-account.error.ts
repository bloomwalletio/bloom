import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class UnableToGetBoundAccountError extends BaseError {
    constructor() {
        super({
            type: 'UnableToGetBoundAccountError',
            message: 'error.account.cannotGetBoundAccount',
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}

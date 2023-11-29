import { localize } from '@core/i18n'
import { showNotification } from '@auxiliary/notification'

import { IErrorParameters } from '../interfaces'
import { addError } from '../stores'

export function logAndNotifyError(errorParameters: IErrorParameters): void {
    const localisedMessage = errorParameters?.localizationKey
        ? localize(errorParameters?.localizationKey)
        : errorParameters?.message
        ? errorParameters.message
        : localize('error.global.generic')

    if (errorParameters?.logToConsole) {
        console.error(errorParameters?.message)
    }

    if (errorParameters?.saveToErrorLog) {
        addError({ ...errorParameters, time: Date.now() })
    }

    if (errorParameters?.showNotification) {
        showNotification({
            variant: 'error',
            text: localisedMessage,
        })
    }
}

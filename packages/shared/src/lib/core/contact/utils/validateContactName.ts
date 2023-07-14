import { localize } from '@core/i18n'
import { CONTACT_NAME_MAX_LENGTH } from '../constants'

export function validateContactName(name: string): void {
    if (!name) {
        throw new Error(localize('error.input.required', { field: localize('general.name') }))
    }

    if (name.length > CONTACT_NAME_MAX_LENGTH) {
        throw new Error(
            localize('error.input.tooLong', { field: localize('general.name'), numCharacters: CONTACT_NAME_MAX_LENGTH })
        )
    }
}

import { localize } from '@core/i18n'
import { CONTACT_NAME_MAX_LENGTH } from '../constants'

export function validateContactAddressName(name: string): void {
    if (!name) {
        throw new Error(localize('error.input.required', { field: localize('general.addressName') }))
    }

    if (name.length > CONTACT_NAME_MAX_LENGTH) {
        throw new Error(
            localize('error.input.tooLong', {
                field: localize('general.addressName'),
                numCharacters: CONTACT_NAME_MAX_LENGTH,
            })
        )
    }

    /**
     * NOTE: We do not need to validate that the name is unique and not being used b/c the user
     * is adding a contact for the first time when they are in this drawer.
     */
}

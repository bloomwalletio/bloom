import { localize } from '@core/i18n'
import { IValidationOptions } from '@core/utils/interfaces'

import { ContactManager } from '../classes'
import { CONTACT_NAME_MAX_LENGTH } from '../constants'

export function validateContactAddressName(options: IValidationOptions, networkId: string): void {
    const { isRequired, mustBeUnique, checkLength } = options

    const name = options?.value as string
    if (isRequired && !name) {
        throw new Error(localize('error.input.required', { field: localize('general.addressName') }))
    }

    if (checkLength && name.length > CONTACT_NAME_MAX_LENGTH) {
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
    if (mustBeUnique) {
        if (
            ContactManager.listContactAddressesForNetwork(networkId).some(
                (contactAddress) => contactAddress.addressName === name
            )
        ) {
            throw new Error(localize('error.input.alreadyUsed', { field: localize('general.addressName') }))
        }
    }
}

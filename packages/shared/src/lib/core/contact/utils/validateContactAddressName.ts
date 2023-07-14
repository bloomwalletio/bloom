import { localize } from '@core/i18n'
import { IValidationOptions } from '@core/utils/interfaces'

import { ContactManager } from '../classes'
import { CONTACT_NAME_MAX_LENGTH } from '../constants'
import { IContactAddress } from '../interfaces'

export function validateContactAddressName(options: IValidationOptions, contactId?: string, networkId?: string): void {
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

    if (mustBeUnique) {
        const contactAddressMap = ContactManager.getNetworkContactAddressMapForContact(contactId )?.[networkId]
        const isAlreadyBeingUsed = Object.values(contactAddressMap).some(
            (contactAddress: IContactAddress) => contactAddress.addressName === name
        )
        if (isAlreadyBeingUsed) {
            throw new Error(localize('error.input.alreadyUsed', { field: localize('general.addressName') }))
        }
    }
}

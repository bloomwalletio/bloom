import { CONTACT_NAME_MAX_LENGTH } from '../constants'

export function validateContactAddressName(name: string): void {
    if (!name) {
        throw new Error('Invalid address name input')
    }

    if (name.length > CONTACT_NAME_MAX_LENGTH) {
        throw new Error('Address name too long')
    }

    /**
     * NOTE: We do not need to validate that the name is unique and not being used b/c the user
     * is adding a contact for the first time when they are in this drawer.
     */
}

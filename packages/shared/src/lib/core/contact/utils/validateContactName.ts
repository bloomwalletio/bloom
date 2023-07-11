import { CONTACT_NAME_MAX_LENGTH } from '../constants'

export function validateContactName(name: string): void {
    if (!name) {
        throw new Error('Invalid name input')
    }

    if (name.length > CONTACT_NAME_MAX_LENGTH) {
        throw new Error('Name too long')
    }
}

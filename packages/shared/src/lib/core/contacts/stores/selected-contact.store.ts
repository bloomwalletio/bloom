import { IContactMetadata } from '@core/contacts/interfaces'
import { get, writable } from 'svelte/store'

export const selectedContact = writable<IContactMetadata | undefined>(undefined)

export function clearSelectedContact(): void {
    selectedContact.set(undefined)
}

export function getSelectedContact(): IContactMetadata | undefined {
    return get(selectedContact)
}

export function setSelectedContact(contact: IContactMetadata): void {
    if (contact) {
        selectedContact.set(contact)
    }
}

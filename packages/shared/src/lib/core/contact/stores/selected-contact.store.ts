import { get, writable } from 'svelte/store'
import { IContactMetadata } from '../interfaces'

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

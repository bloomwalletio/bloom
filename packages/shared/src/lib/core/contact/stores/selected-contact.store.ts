import { get, writable } from 'svelte/store'
import { IContact } from '../interfaces'

export const selectedContact = writable<IContact | undefined>(undefined)

export function clearSelectedContact(): void {
    selectedContact.set(undefined)
}

export function getSelectedContact(): IContact | undefined {
    return get(selectedContact)
}

export function setSelectedContact(contact: IContact): void {
    if (contact) {
        selectedContact.set(contact)
    }
}

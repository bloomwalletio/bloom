import { writable } from 'svelte/store'
import { IContactAddress } from '../interfaces'

export const selectedContactNetworkAddress = writable<IContactAddress | undefined>()

export function setSelectedContactNetworkAddress(contactAddress: IContactAddress): void {
    selectedContactNetworkAddress.set(contactAddress)
}

export function clearSelectedContactNetworkAddress(): void {
    selectedContactNetworkAddress.set(undefined)
}

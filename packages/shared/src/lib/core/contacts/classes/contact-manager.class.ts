import { getActiveProfile, updateActiveProfile } from '@core/profile/stores'
import { generateRandomId } from '@core/utils'
import { getIconColorFromString } from '@core/account/utils'
import type { IContactAddress, IContact, INetworkContactAddressMap, IContactMetadata } from '../interfaces'

export class ContactManager {
    static addContact ({ name, note } : {name: string, note?: string} , {networkId, addressName, address}: {networkId: string, addressName: string, address: string}): void {
        const profile = getActiveProfile()

        const contact: IContact = {
            id: generateRandomId(),
            name,
            color: getIconColorFromString(),
            addresses: [address],
            note,
        }

        const contactAddress: IContactAddress = {
            address,
            contactId: contact.id,
            addressName,
        }

        profile.contacts[contact.id] = contact

        if (!profile.networkContactAddresses[networkId]) {
            profile.networkContactAddresses[networkId] = {}
        }
        profile.networkContactAddresses[networkId][contact.id] = contactAddress

        updateActiveProfile(profile)
    }

    static editContact(contactId: string, payload: Partial<IContactMetadata>): void {
        throw new Error('Method not implemented.')
    }
    static removeContact(contactId: string): void {
        throw new Error('Method not implemented.')
    }
    static listContacts(): IContactMetadata[] {
        throw new Error('Method not implemented.')
    }
    static addContactAddress(contactId: string, networkId: string, addressName: string, address: string): IContactAddress {
        throw new Error('Method not implemented.')
    }
    static editContactAddress(contactId: string, networkId: string, payload: Partial<IContactAddress>): void {
        throw new Error('Method not implemented.')
    }
    static removeContactAddresses(contactId: string, networkId: string): void {
        throw new Error('Method not implemented.')
    }
    static listContactAddresses(contactId: string): INetworkContactAddressMap {
        throw new Error('Method not implemented.')
    }
    static listContactAddressesForNetwork(networkId: string): INetworkContactAddressMap {
        throw new Error('Method not implemented.')
    }
}

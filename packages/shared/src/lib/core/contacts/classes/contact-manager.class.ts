import { getActiveProfile, updateActiveProfile } from '@core/profile/stores'
import { generateRandomId } from '@core/utils'
import { getIconColorFromString } from '@core/account/utils'
import type { IContactAddress, IContact, IContactMetadata } from '../interfaces'

export class ContactManager {
    static getContact(contactId: string): IContact {
        const profile = getActiveProfile()
        return profile.contacts?.[contactId]
    }

    static addContact(
        { name, note }: { name: string; note?: string },
        { networkId, addressName, address }: { networkId: string; addressName: string; address: string }
    ): void {
        const profile = getActiveProfile()

        const contact: IContact = {
            id: generateRandomId(),
            name,
            color: getIconColorFromString(),
            addresses: [],
            note,
        }
        profile.contacts[contact.id] = contact

        ContactManager.addContactAddress(contact.id, networkId, addressName, address)

        updateActiveProfile(profile)
    }

    static updateContact(contactId: string, payload: Partial<IContactMetadata>): void {
        const contact = ContactManager.getContact(contactId)

        if (contact) {
            profile.contacts[contactId] = { ...contact, ...payload }
        } else {
            throw new Error(`Profile with contact ID ${contactId} doesn't exist!`)
        }
    }

    static deleteContact(contactId: string): void {
        const contact = ContactManager.getContact(contactId)

        if (contact) {
            Object.keys(profile.networkContactAddresses).forEach((networkId) => {
                ContactManager.deleteContractAddresses(contact, networkId)
            })
        }
        delete profile.contacts?.[contactId]
    }

    static listContacts(): IContactMetadata[] {
        return Object.entries(profile.contacts)
    }

    static addContactAddress(
        contactId: string,
        networkId: string,
        addressName: string,
        address: string
    ): IContactAddress {
        const contact = ContactManager.getContact(contactId)

        if (contact) {
            contact.address.push(address)
            const contactAddress: IContactAddress = {
                address,
                contactId: contact.id,
                addressName,
            }

            if (!profile.networkContactAddresses[networkId]) {
                profile.networkContactAddresses[networkId] = {}
            }
            profile.networkContactAddresses[networkId][contact.id] = contactAddress
        }
    }

    // TODO: This requires previous address information to be submitted.
    // static updateContactAddress(contactId: string, networkId: string, payload: Partial<IContactAddress>): void {}

    // TODO: do we need to expose this?
    static deleteContactAddresses(contactId: string, networkId: string): void {
        const contact = ContactManager.getContact(contactId)

        contact.addresses.forEach((address) => {
            delete profile.networkContactAddresses?.[networkId]?.[address]
        })
    }
    static listContactAddresses(contactId: string): string[] {
        const contact = ContactManager.getContact(contactId)
        return contact.addresses ?? []
    }

    static listContactAddressesForNetwork(networkId: string): IContactAddressMap {
        const profile = getActiveProfile()
        return profile.networkContactAddresses[networkId]
    }
}

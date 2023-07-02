import { getActiveProfile, updateActiveProfile } from '@core/profile/stores'
import { generateRandomId } from '@core/utils'
import { getIconColorFromString } from '@core/account/utils'
import type {
    IContactAddress,
    IContact,
    IContactMetadata,
    IContactAddressMap,
    INetworkContactAddressMap,
} from '../interfaces'
import { localize } from '@core/i18n'
import { selectedContact } from '../stores'

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

        const id = generateRandomId()
        const contact: IContact = {
            id,
            name,
            color: getIconColorFromString(id),
            addresses: [],
            note,
        }
        profile.contacts[contact.id] = contact

        ContactManager.addContactAddress(contact.id, networkId, addressName, address)

        updateActiveProfile(profile)
    }

    static updateContact(contactId: string, payload: Partial<IContactMetadata>): void {
        const profile = getActiveProfile()
        const contact = ContactManager.getContact(contactId)

        if (contact) {
            profile.contacts[contactId] = { ...contact, ...payload }
            selectedContact.update((selectedContact) => {
                if (selectedContact) {
                    return { ...selectedContact, ...payload }
                }
                return selectedContact
            })
        } else {
            throw new Error(`Profile with contact ID ${contactId} doesn't exist!`)
        }
        updateActiveProfile(profile)
    }

    static deleteContact(contactId: string): void {
        const profile = getActiveProfile()
        const contact = ContactManager.getContact(contactId)

        if (contact) {
            Object.keys(profile.networkContactAddresses).forEach((networkId) => {
                ContactManager.deleteContactAddresses(contactId, networkId)
            })
        }
        delete profile.contacts?.[contactId]
        updateActiveProfile(profile)
    }

    static listContacts(): IContact[] {
        const profile = getActiveProfile()
        return Object.values(profile.contacts)
    }

    static addContactAddress(contactId: string, networkId: string, addressName: string, address: string): void {
        const profile = getActiveProfile()
        const contact = ContactManager.getContact(contactId)

        if (contact) {
            contact.addresses.push(address)
            const contactAddress: IContactAddress = {
                address,
                contactId: contact.id,
                addressName,
            }

            if (!profile.networkContactAddresses[networkId]) {
                profile.networkContactAddresses[networkId] = {}
            }
            profile.networkContactAddresses[networkId][contactAddress.address] = contactAddress
        }
        updateActiveProfile(profile)
    }

    static updateContactAddresses(contactId: string, networkId: string, addresses: { contactId: string, addressName: string, address: string }[]): void {
        const profile = getActiveProfile()
        const contact = ContactManager.getContact(contactId)

        if (contact) {
            addresses.forEach(({ addressName, address }) => {
                const contactAddress: IContactAddress = {
                    address,
                    contactId: contact.id,
                    addressName,
                }

                if (!profile.networkContactAddresses[networkId]) {
                    profile.networkContactAddresses[networkId] = {}
                }
                profile.networkContactAddresses[networkId][contactAddress.address] = contactAddress
            })
            contact.addresses = addresses.map(({ address }) => address)
        }
        updateActiveProfile(profile)
    }

    static deleteContactAddresses(contactId: string, networkId: string, addresses?: string[]): void {
        const profile = getActiveProfile()
        const contact = ContactManager.getContact(contactId)
        const addressesToDelete = addresses ?? contact.addresses

        addressesToDelete.forEach((address) => {
            contact.addresses.splice(contact.addresses.indexOf(address), 1)
            delete profile.networkContactAddresses?.[networkId]?.[address]
        })
        updateActiveProfile(profile)
    }

    static getNetworkContactAddressMapForContact(contactId: string): INetworkContactAddressMap {
        const profile = getActiveProfile()
        const contact = ContactManager.getContact(contactId)
        const addresses = contact.addresses
        const filteredMap = filterNetworkContactAddressMap(profile.networkContactAddresses, addresses)
        return filteredMap
    }

    static listContactAddressesForNetwork(networkId: string): IContactAddress[] {
        const profile = getActiveProfile()
        return Object.values(profile.networkContactAddresses[networkId] ?? {})
    }

    static validateContact(contact: IContactMetadata): void {
        const errors = {
            name: '',
            note: '',
        }

        if (!contact.name) {
            errors.name = localize('error.contacts.nameRequired')
        } else if (contact.name.length >= 20) {
            errors.name = localize('error.contacts.nameTooLong')
        }

        if (contact.note && contact.note.length > 1000) {
            errors.note = localize('error.contacts.noteTooLong')
        }

        const hasAnyErrors = Object.values(errors).some((error) => !!error)

        if (hasAnyErrors) {
            throw errors
        }
    }
}

function filterNetworkContactAddressMap(
    networkContactAddressMap: INetworkContactAddressMap,
    addresses: string[]
): INetworkContactAddressMap {
    const filteredNetworkContactAddressMap: INetworkContactAddressMap = {}

    for (const networkId in networkContactAddressMap) {
        const contactAddressMap: IContactAddressMap = networkContactAddressMap[networkId]
        const filteredContactAddressMap: IContactAddressMap = {}

        for (const address in contactAddressMap) {
            if (addresses.includes(address)) {
                filteredContactAddressMap[address] = contactAddressMap[address]
            }
        }

        if (Object.keys(filteredContactAddressMap).length > 0) {
            filteredNetworkContactAddressMap[networkId] = filteredContactAddressMap
        }
    }

    return filteredNetworkContactAddressMap
}

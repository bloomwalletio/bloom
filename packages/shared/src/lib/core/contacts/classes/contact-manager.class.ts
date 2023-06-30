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
        } else {
            throw new Error(`Profile with contact ID ${contactId} doesn't exist!`)
        }
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
            profile.networkContactAddresses[networkId][contact.id] = contactAddress
        }
    }

    // TODO: This requires previous address information to be submitted.
    // static updateContactAddress(contactId: string, networkId: string, payload: Partial<IContactAddress>): void {}

    // TODO: do we need to expose this?
    static deleteContactAddresses(contactId: string, networkId: string): void {
        const profile = getActiveProfile()
        const contact = ContactManager.getContact(contactId)

        contact.addresses.forEach((address) => {
            delete profile.networkContactAddresses?.[networkId]?.[address]
        })
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

import { getActiveProfile, updateActiveProfile } from '@core/profile/stores'
import { generateRandomId } from '@core/utils'
import { getIconColorFromString } from '@core/account/utils/getIconColorFromString'
import type {
    IContactAddress,
    IContact,
    IContactMetadata,
    IContactAddressMap,
    INetworkContactAddressMap,
} from '../interfaces'
import { selectedContact } from '../stores'
import { NetworkId } from '@core/network'

export class ContactManager {
    static getContact(contactId: string): IContact | undefined {
        return getActiveProfile()?.contacts?.[contactId]
    }

    static addContact(
        { name, note, color }: Pick<IContactMetadata, 'name' | 'note' | 'color'>,
        { networkId, addressName, address }: Omit<IContactAddress, 'contactId'>
    ): void {
        const profile = getActiveProfile()
        if (!profile) {
            throw new Error('Profile is not available.')
        }

        const id = generateRandomId()
        profile.contacts[id] = <IContact>{
            id,
            name,
            color: color ?? getIconColorFromString(id),
            addresses: [],
            note,
        }

        ContactManager.addContactAddress(id, networkId, addressName, address)

        updateActiveProfile(profile)
    }

    static updateContact(contactId: string, payload: Partial<IContactMetadata>): void {
        const profile = getActiveProfile()
        if (!profile) {
            throw new Error('Profile is not available.')
        }

        const contact = ContactManager.getContact(contactId)
        if (!contact) {
            throw new Error(`Profile with contact ID ${contactId} doesn't exist!`)
        }

        profile.contacts[contactId] = {
            ...contact,
            ...payload,
        }
        selectedContact.update((value) => {
            if (value && value.id === contactId) {
                return {
                    ...value,
                    ...payload,
                }
            }
            return value
        })
        updateActiveProfile(profile)
    }

    static deleteContact(contactId: string): void {
        const profile = getActiveProfile()
        if (!profile || !profile.contacts || !profile.networkContactAddresses) {
            throw new Error('Profile is not available or incorrectly formed.')
        }

        const contact = ContactManager.getContact(contactId)
        if (!contact) {
            return
        }

        Object.keys(profile.networkContactAddresses).forEach((networkId) => {
            ContactManager.deleteContactAddressesForNetwork(contactId, networkId as NetworkId)
        })
        delete profile.contacts[contactId]
        updateActiveProfile(profile)
    }

    static listContacts(): IContact[] {
        const profile = getActiveProfile()
        return profile && profile.contacts ? Object.values(profile.contacts) : []
    }

    static addContactAddress(
        contactId: string | undefined,
        networkId: NetworkId,
        addressName: string,
        address: string
    ): void {
        const profile = getActiveProfile()
        if (!profile || !contactId) {
            throw new Error('Profile is not available.')
        }

        const contact = ContactManager.getContact(contactId)
        if (!contact) {
            return
        }

        contact.addresses.push(address)
        const contactAddress: IContactAddress = {
            address,
            addressName,
            networkId,
            contactId: contact.id,
        }
        let addressesForNetwork = profile.networkContactAddresses[networkId]
        if (!addressesForNetwork) {
            addressesForNetwork = {}
        }

        addressesForNetwork[contactAddress.address] = contactAddress
        profile.networkContactAddresses[networkId] = addressesForNetwork
        updateActiveProfile(profile)
    }

    static updateContactAddresses(contactId: string, addresses: IContactAddress[]): void {
        const profile = getActiveProfile()
        if (!profile) {
            throw new Error('Profile is not available.')
        }

        const contact = ContactManager.getContact(contactId)
        if (!contact) {
            return
        }

        addresses.forEach(({ addressName, address, networkId }) => {
            const contactAddress: IContactAddress = {
                address,
                addressName,
                networkId,
                contactId: contact.id,
            }

            let addressesForNetwork = profile.networkContactAddresses[networkId]
            if (!addressesForNetwork) {
                addressesForNetwork = {}
            }
            addressesForNetwork[contactAddress.address] = contactAddress
            profile.networkContactAddresses[networkId] = addressesForNetwork
        })
        contact.addresses = Array.from(new Set([...contact.addresses, ...addresses.map(({ address }) => address)]))
        updateActiveProfile(profile)
    }

    static deleteContactAddressesForNetwork(contactId: string, networkId: NetworkId): void {
        const addresses = Object.keys(this.getNetworkContactAddressMapForContact(contactId)?.[networkId] ?? {})
        this.deleteContactAddresses(contactId, networkId, addresses)
    }

    static deleteContactAddresses(contactId: string, networkId: NetworkId, addresses: string[]): void {
        const profile = getActiveProfile()
        if (!profile) {
            throw new Error('Profile is not available.')
        }

        const contact = ContactManager.getContact(contactId)
        if (!contact) {
            throw new Error(`Contact with ID ${contactId} doesn't exist!`)
        }

        addresses.forEach((address) => {
            const index = contact.addresses.indexOf(address)
            if (index > -1) {
                contact.addresses.splice(index, 1)
                delete profile.networkContactAddresses[networkId]?.[address]
            }
        })
        contact.addresses = contact.addresses.filter((address) => !addresses.includes(address))
        updateActiveProfile(profile)
    }

    static getContactForAddress(networkId: NetworkId, address: string): IContact | undefined {
        const profile = getActiveProfile()
        if (!profile) {
            return undefined
        }

        const contactId = profile.networkContactAddresses[networkId]?.[address]?.contactId
        return contactId ? ContactManager.getContact(contactId) : undefined
    }

    static getNetworkContactAddressMapForContact(contactId: string): INetworkContactAddressMap {
        const profile = getActiveProfile()
        if (!profile) {
            throw new Error('Profile is not available.')
        }

        const contact = ContactManager.getContact(contactId)
        if (!contact) {
            throw new Error(`Contact with ID ${contactId} doesn't exist!`)
        }

        return filterNetworkContactAddressMap(profile.networkContactAddresses, contact.addresses)
    }

    static listContactAddressesForNetwork(networkId: NetworkId): IContactAddress[] {
        const profile = getActiveProfile()
        return profile && profile.networkContactAddresses && profile.networkContactAddresses[networkId]
            ? Object.values(profile.networkContactAddresses[networkId] ?? {})
            : []
    }
}

function filterNetworkContactAddressMap(
    networkContactAddressMap: INetworkContactAddressMap,
    addresses: string[]
): INetworkContactAddressMap {
    const filteredNetworkContactAddressMap: INetworkContactAddressMap = {}

    for (const networkId in networkContactAddressMap) {
        const contactAddressMap: IContactAddressMap = networkContactAddressMap[networkId as NetworkId] ?? {}
        const filteredContactAddressMap: IContactAddressMap = {}

        for (const address in contactAddressMap) {
            if (addresses.includes(address)) {
                /**
                 * NOTE: This is a shallow copy, so we do not edit the stored contactAddress by accident.
                 */
                filteredContactAddressMap[address] = { ...contactAddressMap[address] }
            }
        }

        if (Object.keys(filteredContactAddressMap).length > 0) {
            filteredNetworkContactAddressMap[networkId as NetworkId] = filteredContactAddressMap
        }
    }

    return filteredNetworkContactAddressMap
}

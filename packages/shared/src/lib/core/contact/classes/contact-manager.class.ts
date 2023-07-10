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
    static getContact(contactId: string): IContact | undefined {
        return getActiveProfile()?.contacts?.[contactId]
    }

    static addContact(
        { name, note }: Pick<IContactMetadata, 'name' | 'note'>,
        { networkId, addressName, address }: Omit<IContactAddress, 'contactId'>
    ): void {
        const profile = getActiveProfile()

        if (profile) {
            const id = generateRandomId()
            profile.contacts[id] = <IContact>{
                id,
                name,
                color: getIconColorFromString(id),
                addresses: [],
                note,
            }

            ContactManager.addContactAddress(id, networkId, addressName, address)

            updateActiveProfile(profile)
        } else {
            throw new Error('Profile is not available.')
        }
    }

    static updateContact(contactId: string, payload: Partial<IContactMetadata>): void {
        const profile = getActiveProfile()

        if (profile) {
            const contact = ContactManager.getContact(contactId)

            if (contact) {
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
            } else {
                throw new Error(`Profile with contact ID ${contactId} doesn't exist!`)
            }
            updateActiveProfile(profile)
        } else {
            throw new Error('Profile is not available.')
        }
    }

    static deleteContact(contactId: string): void {
        const profile = getActiveProfile()

        if (profile && profile.contacts && profile.networkContactAddresses) {
            const contact = ContactManager.getContact(contactId)

            if (contact) {
                Object.keys(profile.networkContactAddresses).forEach((networkId) => {
                    ContactManager.deleteContactAddresses(contactId, networkId)
                })
                delete profile.contacts[contactId]
            }
            updateActiveProfile(profile)
        } else {
            throw new Error('Profile is not available or incorrectly formed.')
        }
    }

    static listContacts(): IContact[] {
        const profile = getActiveProfile()
        return profile && profile.contacts ? Object.values(profile.contacts) : []
    }

    static addContactAddress(contactId: string, networkId: string, addressName: string, address: string): void {
        const profile = getActiveProfile()

        if (profile) {
            const contact = ContactManager.getContact(contactId)

            if (contact) {
                contact.addresses.push(address)
                const contactAddress: IContactAddress = {
                    address,
                    addressName,
                    networkId,
                    contactId: contact.id,
                }

                if (!profile.networkContactAddresses[networkId]) {
                    profile.networkContactAddresses[networkId] = {}
                }
                profile.networkContactAddresses[networkId][contactAddress.address] = contactAddress
            }
            updateActiveProfile(profile)
        } else {
            throw new Error('Profile is not available.')
        }
    }

    static updateContactAddresses(contactId: string, addresses: IContactAddress[]): void {
        const profile = getActiveProfile()

        if (profile) {
            const contact = ContactManager.getContact(contactId)

            if (contact) {
                addresses.forEach(({ addressName, address, networkId }) => {
                    const contactAddress: IContactAddress = {
                        address,
                        addressName,
                        networkId,
                        contactId: contact.id,
                    }

                    if (!profile.networkContactAddresses[networkId]) {
                        profile.networkContactAddresses[networkId] = {}
                    }
                    profile.networkContactAddresses[networkId][contactAddress.address] = contactAddress
                })
                contact.addresses = addresses.map(({ address }) => address)
            }
            updateActiveProfile(profile)
        } else {
            throw new Error('Profile is not available.')
        }
    }

    static deleteContactAddresses(contactId: string, networkId: string, addresses?: string[]): void {
        const profile = getActiveProfile()

        if (profile) {
            const contact = ContactManager.getContact(contactId)

            if (!contact) {
                throw new Error(`Contact with ID ${contactId} doesn't exist!`)
            }

            const addressesToDelete = addresses || contact.addresses

            addressesToDelete.forEach((address) => {
                const index = contact.addresses.indexOf(address)
                if (index > -1) {
                    contact.addresses.splice(index, 1)
                    delete profile.networkContactAddresses[networkId][address]
                }
            })
            updateActiveProfile(profile)
        } else {
            throw new Error('Profile is not available.')
        }
    }

    static getNetworkContactAddressMapForContact(contactId: string): INetworkContactAddressMap {
        const profile = getActiveProfile()

        if (profile) {
            const contact = ContactManager.getContact(contactId)

            if (!contact) {
                throw new Error(`Contact with ID ${contactId} doesn't exist!`)
            }

            const addresses = contact.addresses
            const filteredMap = filterNetworkContactAddressMap(profile.networkContactAddresses, addresses)
            return filteredMap
        } else {
            throw new Error('Profile is not available.')
        }
    }

    static listContactAddressesForNetwork(networkId: string): IContactAddress[] {
        const profile = getActiveProfile()
        return profile && profile.networkContactAddresses && profile.networkContactAddresses[networkId]
            ? Object.values(profile.networkContactAddresses[networkId])
            : []
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

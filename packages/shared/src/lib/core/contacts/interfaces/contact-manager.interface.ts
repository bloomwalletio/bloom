import type { IContactAddress, IContactMetadata, INetworkContactAddressMap } from './'

export interface IContactManager {
    addContact(name: string, note?: string): IContactMetadata
    editContact(contactId: string, payload: Partial<IContactMetadata>): void
    removeContact(contactId: string): void
    listContacts(): IContactMetadata[]

    addContactAddress(contactId: string, networkId: string, alias: string, address: string): IContactAddress
    editContactAddress(contactId: string, networkId: string, payload: Partial<IContactAddress>): void
    removeContactAddresses(contactId: string, networkId: string): void
    listContactAddresses(contactId: string): INetworkContactAddressMap

    listContactAddressesForNetwork(networkId: string): INetworkContactAddressMap
}

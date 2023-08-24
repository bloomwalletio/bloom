import { NetworkId } from '@core/network/types'

/**
 * Describes a contact address object, containing an address string and alias.
 */
export interface IContactAddress {
    address: string
    addressName: string
    contactId: string
    networkId: NetworkId
}

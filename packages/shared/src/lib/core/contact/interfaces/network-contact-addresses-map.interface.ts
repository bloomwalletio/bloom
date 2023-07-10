import { IContactAddressMap } from './contact-address-map.interface'

/**
 * Describes addresses per network / chain for a contact.
 */
export interface INetworkContactAddressMap {
    [networkId: string]: IContactAddressMap
}

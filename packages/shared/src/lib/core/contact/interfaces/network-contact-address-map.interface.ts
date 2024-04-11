import { NetworkId } from '@core/network/types'
import { IContactAddressMap } from './contact-address-map.interface'

/**
 * Describes addresses per network for a contact.
 */
export type INetworkContactAddressMap = {
    [networkId in NetworkId]?: IContactAddressMap
}

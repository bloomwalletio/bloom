import { ContactManager } from '@core/contact'
import { NetworkId } from '@core/network'
import { findActiveAccountWithAddress } from '@core/profile/actions'
import { SubjectType } from '../enums'
import { Subject } from '../types'
import { getNetworkFromAddress } from '@core/layer-2/actions'

export function getSubjectFromAddress(address: string, networkId: NetworkId): Subject {
    const account = findActiveAccountWithAddress(address, networkId)
    if (account) {
        return { type: SubjectType.Account, account, address }
    }

    const network = getNetworkFromAddress(address)
    if (network) {
        return { type: SubjectType.Network, id: network.id, name: network.name, address }
    }

    const contact = networkId ? ContactManager.getContactForAddress(networkId, address) : undefined
    if (contact) {
        return { type: SubjectType.Contact, contact, address }
    }

    return { type: SubjectType.Address, address }
}

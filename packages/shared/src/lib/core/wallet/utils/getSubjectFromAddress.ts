import { findActiveAccountWithAddress } from '@core/profile'
import { Subject } from '../types'
import { ContactManager } from '@core/contact'
import { getNetwork } from '@core/network'

export function getSubjectFromAddress(address: string, networkId?: string): Subject {
    const account = findActiveAccountWithAddress(address)

    // TODO: update network name to network id once that is updated in the contact book
    const networkName = networkId ?? getNetwork()?.getMetadata().name

    const contact = ContactManager.getContactForAddress(networkName, address)

    if (account) {
        return { type: 'account', account }
    } else if (contact) {
        return { type: 'contact', contact, address }
    } else {
        return { type: 'address', address }
    }
}

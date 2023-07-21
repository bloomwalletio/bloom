import { findActiveAccountWithAddress } from '@core/profile'
import { Subject } from '../types'
import { ContactManager } from '@core/contact'
import { getNetwork } from '@core/network'
import { SubjectType } from '../enums'

export function getSubjectFromAddress(address: string, networkId?: string): Subject {
    const account = findActiveAccountWithAddress(address)

    // TODO: update network name to network id once that is updated in the contact book
    const networkName = networkId ?? getNetwork()?.getMetadata().name
    const contact = networkName ? ContactManager.getContactForAddress(networkName, address) : undefined
    if (account) {
        return { type: SubjectType.Account, account }
    } else if (contact) {
        return { type: SubjectType.Contact, contact, address }
    } else {
        return { type: SubjectType.Address, address }
    }
}

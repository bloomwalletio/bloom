import { ContactManager } from '@core/contact'
import { NetworkId } from '@core/network'
import { findActiveAccountWithAddress } from '@core/profile/actions'
import { SubjectType } from '../enums'
import { Subject } from '../types'

export function getSubjectFromAddress(address: string, networkId?: NetworkId): Subject {
    const account = findActiveAccountWithAddress(address)

    const contact = networkId ? ContactManager.getContactForAddress(networkId, address) : undefined
    if (account) {
        return { type: SubjectType.Account, account, address: account.depositAddress }
    } else if (contact) {
        return { type: SubjectType.Contact, contact, address }
    } else {
        return { type: SubjectType.Address, address }
    }
}

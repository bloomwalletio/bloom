import { ContactManager } from '@core/contact'
import { NetworkId } from '@core/network'
import { findActiveAccountWithAddress } from '@core/profile/actions'
import { SubjectType } from '../enums'
import { Subject } from '../types'
import { getNetworkFromAddress } from '@core/layer-2/actions'
import { ISC_MAGIC_CONTRACT_ADDRESS, ISC_MAGIC_CONTRACT_ADDRESS2 } from '@core/layer-2'
import { localize } from '@core/i18n'

export function getSubjectFromAddress(address: string, networkId: NetworkId): Subject {
    const account = findActiveAccountWithAddress(address, networkId)
    if (account) {
        return { type: SubjectType.Account, account, address }
    }

    if (address === ISC_MAGIC_CONTRACT_ADDRESS || address === ISC_MAGIC_CONTRACT_ADDRESS2) {
        return { type: SubjectType.SmartContract, name: localize('general.magicContract'), address, verified: true }
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

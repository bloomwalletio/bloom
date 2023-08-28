import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import { get } from 'svelte/store'
import { activeAccounts } from '../../stores'
import { NetworkId } from '@core/network'

/**
 * Find an address in one of our accounts
 * @param address The address to find
 * @param networkId The corresponding network
 * @returns The wallet account matching the address or undefined if not found
 */
export function findActiveAccountWithAddress(address: string, networkId: NetworkId): IAccountState | undefined {
    const accounts = get(activeAccounts)

    return accounts.find((account) => address === getAddressFromAccountForNetwork(account, networkId))
}

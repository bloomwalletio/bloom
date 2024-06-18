import { EvmNetworkId } from '@core/network'
import { toChecksumAddress } from '@ethereumjs/util'
import { Caip10Address } from '../types'
import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'

export function buildCaip10Address(address: string, evmNetworkId: EvmNetworkId): Caip10Address {
    return `${evmNetworkId}:${toChecksumAddress(address)}`
}

export function getCaip10AddressForAccount(
    account: IAccountState,
    evmNetworkId: EvmNetworkId
): Caip10Address | undefined {
    const accountAddress = getAddressFromAccountForNetwork(account, evmNetworkId)
    return accountAddress ? buildCaip10Address(accountAddress, evmNetworkId) : undefined
}

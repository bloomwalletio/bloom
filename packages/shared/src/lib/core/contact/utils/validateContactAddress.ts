import { get } from 'svelte/store'

import { selectedAccount } from '@core/account/stores'
import { DestinationNetwork } from '@core/layer-2/enums'
import { DEFAULT_CHAIN_CONFIGURATIONS } from '@core/network/constants'
import { getActiveNetworkId } from '@core/network/utils/getNetworkId'
import { getNetworkHrp } from '@core/profile/actions'
import { getActiveProfilePersistedAccountData } from '@core/profile/stores'
import { isValidBech32AddressAndPrefix, validateEthereumAddress } from '@core/utils/crypto'

import { ContactManager } from '../classes'

export function validateContactAddress(address: string, networkId: string): void {
    if (!address) {
        throw new Error('Invalid address input')
    }

    switch (networkId) {
        case DestinationNetwork.Shimmer:
        case DestinationNetwork.Testnet:
            if (!isValidBech32AddressAndPrefix(address, getNetworkHrp())) {
                throw new Error('Invalid Bech32 format')
            }
            if (
                address === getActiveProfilePersistedAccountData(get(selectedAccount)?.index as number)?.depositAddress
            ) {
                /* eslint-disable quotes */
                throw new Error(`Cannot be this account's address`)
            }
            if (
                ContactManager.listContactAddressesForNetwork(networkId)
                    .map((contactAddress) => contactAddress.address)
                    .includes(address)
            ) {
                throw new Error('Address already being used')
            }
            break
        case DestinationNetwork.ShimmerEvm:
        case DestinationNetwork.ShimmerEvmTestnet: {
            validateEthereumAddress(address)
            const coinType = DEFAULT_CHAIN_CONFIGURATIONS[getActiveNetworkId()]?.coinType
            if (address === get(selectedAccount)?.evmAddresses[coinType]) {
                /* eslint-disable quotes */
                throw new Error(`Cannot be this account's address`)
            }

            if (
                ContactManager.listContactAddressesForNetwork(networkId)
                    .map((contactAddress) => contactAddress.address)
                    .includes(address)
            ) {
                throw new Error('Address already being used')
            }
            break
        }
    }
}

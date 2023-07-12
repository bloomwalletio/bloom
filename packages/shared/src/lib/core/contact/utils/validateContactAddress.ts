import { get } from 'svelte/store'

import { selectedAccount } from '@core/account/stores'
import { localize } from '@core/i18n'
import { DestinationNetwork } from '@core/layer-2/enums'
import { DEFAULT_CHAIN_CONFIGURATIONS } from '@core/network/constants'
import { getActiveNetworkId } from '@core/network/utils/getNetworkId'
import { getNetworkHrp } from '@core/profile/actions'
import { getActiveProfilePersistedAccountData } from '@core/profile/stores'
import { isValidBech32AddressAndPrefix, validateEthereumAddress } from '@core/utils/crypto'

import { ContactManager } from '../classes'

export function validateContactAddress(address: string, networkId: string): void {
    if (!address) {
        throw new Error(localize('error.input.required', { field: localize('general.address') }))
    }

    switch (networkId) {
        case DestinationNetwork.Shimmer:
        case DestinationNetwork.Testnet:
            if (!isValidBech32AddressAndPrefix(address, getNetworkHrp())) {
                throw new Error(localize('error.address.invalidBech32Format'))
            }
            if (
                address === getActiveProfilePersistedAccountData(get(selectedAccount)?.index as number)?.depositAddress
            ) {
                throw new Error(localize('error.address.belongsToAccount'))
            }
            break
        case DestinationNetwork.ShimmerEvm:
        case DestinationNetwork.ShimmerEvmTestnet: {
            validateEthereumAddress(address)
            const coinType = DEFAULT_CHAIN_CONFIGURATIONS[getActiveNetworkId()]?.coinType
            if (address === get(selectedAccount)?.evmAddresses[coinType]) {
                throw new Error(localize('error.address.belongsToAccount'))
            }
            break
        }
    }

    if (
        ContactManager.listContactAddressesForNetwork(networkId)
            .map((contactAddress) => contactAddress.address)
            .includes(address)
    ) {
        throw new Error(localize('error.address.alreadyBeingUsed'))
    }
}

import { localize } from '@core/i18n'
import { DestinationNetwork } from '@core/layer-2/enums'
import { getNetworkHrp } from '@core/profile/actions'
import { isValidBech32AddressAndPrefix, validateEthereumAddress } from '@core/utils/crypto'
import { isAccountAddress } from '@core/wallet/utils'

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
            break
        case DestinationNetwork.ShimmerEvm:
        case DestinationNetwork.ShimmerEvmTestnet: {
            validateEthereumAddress(address)
            break
        }
    }

    if (isAccountAddress(address, networkId as DestinationNetwork)) {
        throw new Error(localize('error.address.belongsToAccount'))
    }

    if (
        ContactManager.listContactAddressesForNetwork(networkId)
            .map((contactAddress) => contactAddress.address)
            .includes(address)
    ) {
        throw new Error(localize('error.address.alreadyBeingUsed'))
    }
}

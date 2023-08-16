import { localize } from '@core/i18n'
import { DestinationNetwork } from '@core/layer-2/enums'
import { getNetworkHrp } from '@core/profile/actions'
import { isValidBech32AddressAndPrefix, validateEthereumAddress } from '@core/utils/crypto'
import { IValidationOptions } from '@core/utils/interfaces'
import { isAccountAddress } from '@core/account/actions'

import { ContactManager } from '../classes'

export function validateContactAddress(options: IValidationOptions, networkId: string): void {
    const { isRequired, mustBeUnique } = options

    const address = options?.value as string
    if (isRequired && !address) {
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

    if (mustBeUnique) {
        const isAlreadyBeingUsed = ContactManager.listContactAddressesForNetwork(networkId).some(
            (contactAddress) => contactAddress.address === address
        )
        if (isAlreadyBeingUsed) {
            throw new Error(localize('error.input.alreadyUsed', { field: localize('general.address') }))
        }
    }
}

import { NetworkId, isStardustNetwork } from '@core/network'
import { validateBech32Address, validateEthereumAddress } from '@core/utils/crypto'
import { getNetworkHrp } from '@core/profile/actions'

export function validateAddressFormatForNetwork(address: string, destinationNetworkId: NetworkId): void {
    if (isStardustNetwork(destinationNetworkId)) {
        validateBech32Address(getNetworkHrp(), address)
    } else {
        validateEthereumAddress(address)
    }
}

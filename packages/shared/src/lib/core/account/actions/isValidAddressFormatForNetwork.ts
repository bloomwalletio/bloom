import { NetworkId, isStardustNetwork } from '@core/network'
import { validateBech32Address, validateEthereumAddress } from '@core/utils/crypto'
import { getNetworkHrp } from '@core/profile/actions'

export function isValidAddressFormatForNetwork(address: string, destinationNetworkId: NetworkId): string {
    if (isStardustNetwork(destinationNetworkId)) {
        try {
            validateBech32Address(getNetworkHrp(), address)
            return ''
        } catch (error) {
            return error as string
        }
    } else {
        try {
            validateEthereumAddress(address)
            return ''
        } catch (error) {
            return error as string
        }
    }
}

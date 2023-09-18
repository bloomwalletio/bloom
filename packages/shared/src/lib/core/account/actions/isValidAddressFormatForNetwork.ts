import { localize } from '@core/i18n'
import { NetworkId, isStardustNetwork } from '@core/network'
import { getNetworkHrp } from '@core/profile/actions'
import { isValidBech32AddressAndPrefix, validateEthereumAddress } from '@core/utils/crypto'

export function isValidAddressFormatForNetwork(address: string, destinationNetworkId: NetworkId): string {
    if (isStardustNetwork(destinationNetworkId)) {
        return isValidBech32AddressAndPrefix(address, getNetworkHrp())
            ? ''
            : localize('error.address.invalidBech32Format')
    } else {
        try {
            validateEthereumAddress(address)
            return ''
        } catch (error) {
            return error as string
        }
    }
}

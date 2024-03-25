import { getNetworkHrp } from '@core/profile/actions'
import { Converter } from '@core/utils/convert'
import { Bech32Helper } from '@core/utils/crypto'

export function convertBech32ToHexAddress(bech32Address: string): string {
    const { addressBytes } = Bech32Helper.fromBech32(bech32Address, getNetworkHrp())
    return Converter.bytesToHex(addressBytes)
}

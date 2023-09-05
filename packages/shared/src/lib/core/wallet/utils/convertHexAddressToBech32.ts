import { getNetworkHrp } from '@core/profile/actions'
import { Converter } from '@core/utils/convert'
import { Bech32Helper } from '@core/utils/crypto'

export function convertHexAddressToBech32(addressType: number, hexAddress: string): string {
    return Bech32Helper.toBech32(addressType, Converter.hexToBytes(hexAddress), getNetworkHrp())
}

import { IscL1Address } from '@core/isc/types'
import { Bech32Helper } from '@core/utils'

export function buildIscL1AddressFromBech32Address(address: string): IscL1Address {
    const hrp = address.split('1')[0]
    const { addressBytes } = Bech32Helper.fromBech32(address, hrp) ?? {}
    return {
        data: new Uint8Array([0, ...(addressBytes ?? [])]),
    }
}

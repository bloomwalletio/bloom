import { WriteStream } from '@iota/util.js'
import { Converter } from '@core/utils'
import { IChain } from '@core/network'
import { evmAddressToAgentId } from './evmAddressToAgentId'

export function encodeAddress(address: string, chain: IChain): Uint8Array {
    const addressStream = new WriteStream()
    const addressBytes = Converter.hexToBytes(address)
    for (const byte of addressBytes) {
        addressStream.writeUInt8('Address byte', byte)
    }
    const hexAddress = addressStream.finalHex()

    const encodedAddress = evmAddressToAgentId(hexAddress, chain)
    return encodedAddress
}

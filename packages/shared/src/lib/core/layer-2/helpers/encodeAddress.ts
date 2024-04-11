import { WriteStream } from '@iota/util.js'
import { Converter } from '@core/utils'
import { EvmNetworkType, IEvmNetwork } from '@core/network'
import { evmAddressToAgentId } from './evmAddressToAgentId'

export function encodeAddress(address: string, evmNetwork: IEvmNetwork): Uint8Array {
    const addressStream = new WriteStream()
    const addressBytes = Converter.hexToBytes(address)
    for (const byte of addressBytes) {
        addressStream.writeUInt8('Address byte', byte)
    }
    const hexAddress = addressStream.finalHex()

    const encodedAddress = evmAddressToAgentId(hexAddress, evmNetwork.type === EvmNetworkType.Iscp ? evmNetwork.aliasAddress : '')
    return encodedAddress
}

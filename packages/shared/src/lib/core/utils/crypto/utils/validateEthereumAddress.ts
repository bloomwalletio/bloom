import { localize } from '@core/i18n'
import { Keccak } from 'sha3'
import { HEXADECIMAL_PREFIX } from '../../constants'
import { KECCAK_HASH_SIZE } from '../constants'

export function validateEthereumAddress(address: string): void {
    // 1. Check prefix
    if (!/^(0x)*/i.test(address)) {
        throw new Error(localize('error.send.wrongAddressPrefix', { prefix: HEXADECIMAL_PREFIX }))
        // 2. Check hex format
    } else if (!/^(0x)?[0-9a-f]*/i.test(address)) {
        throw new Error(localize('error.send.wrongAddressFormat'))
        // 3. Check character length
    } else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        throw new Error(localize('error.send.addressLength', { length: 42 }))
        // 4. If not consistent capitalization then check EIP 55 checksum
    } else if (!(/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address))) {
        validateEthereumAddressChecksum(address)
    }
}

// Check if EIP-55 mixed-case checksum address encoding is followed (https://eips.ethereum.org/EIPS/eip-55)
function validateEthereumAddressChecksum(address: string): void {
    address = address.replace('0x', '')
    const keccak256 = new Keccak(KECCAK_HASH_SIZE)
    const addressHash = keccak256.update(address.toLowerCase()).digest('hex')
    for (let i = 0; i < address.length; i++) {
        // The nth letter should be uppercase if the nth digit of casemap is 1
        if (
            (parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
            (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])
        ) {
            throw new Error(localize('error.address.checksum'))
        }
    }
}

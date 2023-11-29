import { validateEthereumAddress } from './validateEthereumAddress'

export function isValidEthereumAddress(address: string): boolean {
    try {
        validateEthereumAddress(address)
        return true
    } catch {
        return false
    }
}

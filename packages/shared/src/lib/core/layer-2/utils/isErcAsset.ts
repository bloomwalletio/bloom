import { isValidEthereumAddress } from '@core/utils/crypto/utils/isValidEthereumAddress'

export function isErcAsset(assetId: string): boolean {
    const [address] = assetId.split(':')

    return isValidEthereumAddress(address)
}

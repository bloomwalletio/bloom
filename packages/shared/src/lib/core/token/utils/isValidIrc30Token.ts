import { MAX_SUPPORTED_DECIMALS } from '@core/wallet/constants'
import { TokenMetadata } from '../types'

export function isValidIrc30Token(tokenMetadata: TokenMetadata): boolean {
    return tokenMetadata.decimals <= MAX_SUPPORTED_DECIMALS
}

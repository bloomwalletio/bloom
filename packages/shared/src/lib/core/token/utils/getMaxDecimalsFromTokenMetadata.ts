import { TokenMetadata } from '../types'
import { TokenStandard } from '../enums'

export function getMaxDecimalsFromTokenMetadata(metadata: TokenMetadata, selectedUnit?: string): number {
    let maxDecimals = 0
    if (metadata?.standard === TokenStandard.BaseToken) {
        if (selectedUnit && selectedUnit === metadata?.unit) {
            maxDecimals = Math.min(metadata?.decimals, 18)
        } else if (selectedUnit === metadata?.subunit) {
            maxDecimals = 0
        } else {
            maxDecimals = Math.min(metadata?.decimals, 18)
        }
    } else {
        maxDecimals = Math.min(metadata?.decimals, 18)
    }
    return maxDecimals
}

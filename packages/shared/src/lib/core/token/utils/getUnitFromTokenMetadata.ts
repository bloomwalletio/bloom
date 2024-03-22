import { TokenStandard } from '../enums'
import { TokenMetadata } from '../types'

export function getUnitFromTokenMetadata(tokenMetadata: TokenMetadata | undefined): string {
    if (!tokenMetadata) {
        return ''
    }
    const isBaseToken = tokenMetadata?.standard === TokenStandard.BaseToken
    return isBaseToken ? tokenMetadata?.unit : tokenMetadata?.symbol
}

import { formatNumber } from '@core/i18n'
import { TokenStandard } from '@core/token/enums'
import { TokenMetadata } from '@core/token/types'

export function formatTokenAmountPrecise(amount: number, tokenMetadata: TokenMetadata): string {
    const formattedAmount = formatNumber(amount, 0, 0, 0, true)
    if (tokenMetadata.standard === TokenStandard.BaseToken) {
        return formattedAmount + ' ' + tokenMetadata?.subunit
    } else {
        return formattedAmount + ' ' + tokenMetadata?.symbol
    }
}

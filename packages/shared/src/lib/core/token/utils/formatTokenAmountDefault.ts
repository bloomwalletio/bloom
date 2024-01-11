import { formatNumber } from '@core/i18n'
import { TokenStandard } from '@core/token/enums'
import { TokenMetadata } from '@core/token/types'

export function formatTokenAmountDefault(
    amount: number,
    tokenMetadata: TokenMetadata | undefined,
    unit?: string,
    useGrouping: boolean = true
): string {
    if (amount < 0) {
        console.error('Amount is negative')
        return ''
    } else if (isDecimal(amount)) {
        console.error('Amount is a decimal number')
        return ''
    } else if (unit && tokenMetadata?.standard === TokenStandard.BaseToken && unit === tokenMetadata?.subunit) {
        return formatNumber(amount, 0, 0, 0, useGrouping)
    } else {
        const value = tokenMetadata?.decimals ? amount / 10 ** tokenMetadata?.decimals : amount
        return formatNumber(value, 0, tokenMetadata?.decimals ?? 0, 0, useGrouping)
    }
}

function isDecimal(amount: number): boolean {
    if (amount % 1 === 0) {
        return false
    } else {
        return true
    }
}

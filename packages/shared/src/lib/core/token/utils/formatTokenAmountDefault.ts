import { formatNumber } from '@core/i18n'
import { TokenStandard } from '@core/token/enums'
import { TokenMetadata } from '@core/token/types'

export function formatTokenAmountDefault(
    amount: bigint,
    tokenMetadata: TokenMetadata,
    unit?: string,
    useGrouping: boolean = true
): string {
    if (amount < 0) {
        throw new Error('Amount is negative')
    } else if (unit && tokenMetadata?.standard === TokenStandard.BaseToken && unit === tokenMetadata?.subunit) {
        return formatNumber(Number(amount), 0, 0, 0, useGrouping)
    } else {
        const value = tokenMetadata?.decimals ? amount / BigInt(10 ** tokenMetadata?.decimals) : amount
        return formatNumber(Number(value), 0, tokenMetadata?.decimals ?? 0, 0, useGrouping)
    }
}

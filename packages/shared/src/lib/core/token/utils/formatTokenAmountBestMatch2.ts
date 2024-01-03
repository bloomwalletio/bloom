import { formatNumber } from '@core/i18n'
import { isDecimal } from '@core/utils'
import { getUnitFromTokenMetadata } from './getUnitFromTokenMetadata'

export function formatTokenAmountBestMatch2(
    amount: number,
    tokenMetadata: TokenMetadata,
    withUnit = true,
    round = true
): string {
    if (amount < 0) {
        throw new Error('Amount is negative')
    }

    if (isDecimal(amount)) {
        throw new Error('Amount is a decimal number')
    }

    if (amount > Number.MAX_SAFE_INTEGER) {
        throw new Error('Amount is too large to be formatted')
    }

    if (isNaN(amount)) {
        return formatNumber(0, 0, 0, 0, true)
    }

    const unit = withUnit ? getUnitFromTokenMetadata(tokenMetadata) : undefined

    if (!round) {
        const formattedAmount = formatNumber(amount, 0, undefined, undefined, true)
        return unit ? formattedAmount + ' ' + unit  : formattedAmount
    }

    const floatAmount = tokenMetadata?.decimals ? amount / 10 ** tokenMetadata?.decimals : amount

    const stringAmount = amount.toString()
    const splittedAmount = stringAmount.split('.')
    const integer = splittedAmount[0]
    const decimals = splittedAmount[1]
}

import { parseCurrency } from '@core/i18n'
import { TokenStandard } from '@core/token/enums'
import { TokenMetadata } from '@core/token/types'

export function convertToRawAmount(amount: string, tokenMetadata: TokenMetadata, unit?: string): bigint | undefined {
    if (amount) {
        const parsedAmount = parseCurrency(amount)
        return convertToRawAmountFromMetadata(parsedAmount, tokenMetadata, unit)
    } else {
        return undefined
    }
}

function convertToRawAmountFromMetadata(
    amount: string | undefined,
    tokenMetadata: TokenMetadata,
    selectedUnit?: string
): bigint | undefined {
    if (!amount) {
        return undefined
    }

    if (tokenMetadata?.standard === TokenStandard.BaseToken) {
        if (!selectedUnit || selectedUnit === tokenMetadata.unit) {
            return convertFloatToBigInt(amount, tokenMetadata.decimals)
        } else if (selectedUnit === tokenMetadata.subunit) {
            return BigInt(amount)
        } else {
            return undefined
        }
    } else if (tokenMetadata?.standard === TokenStandard.Irc30 || tokenMetadata?.standard === TokenStandard.Erc20) {
        return convertFloatToBigInt(amount, tokenMetadata.decimals)
    } else {
        throw new Error('convertToRawAmountFromMetadata: Invalid token standard')
    }
}

function convertFloatToBigInt(amount: string, maxDecimals: number): bigint {
    const parts = amount.split('.')
    const integerPart = parts[0]
    const decimalPart = parts[1] ?? ''
    const decimalPartPadded = decimalPart.padEnd(maxDecimals, '0')
    return BigInt(integerPart + decimalPartPadded)
}

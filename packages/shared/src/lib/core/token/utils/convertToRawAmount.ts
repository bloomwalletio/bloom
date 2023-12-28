import { parseCurrency } from '@core/i18n'
import { TokenStandard } from '@core/token/enums'
import { TokenMetadata } from '@core/token/types'
import { MAX_SUPPORTED_DECIMALS } from '@core/wallet/constants'

export function convertToRawAmount(amount: string, tokenMetadata: TokenMetadata, unit?: string): bigint | undefined {
    if (amount) {
        const parsedAmount = parseCurrency(amount)
        return convertToRawAmountFromMetadata(parsedAmount, tokenMetadata, unit)
    } else {
        return undefined
    }
}

function convertToRawAmountFromMetadata(
    amount: number,
    tokenMetadata: TokenMetadata,
    selectedUnit?: string
): bigint | undefined {
    const [min] = bigIntMinAndMax(tokenMetadata.decimals, MAX_SUPPORTED_DECIMALS)

    if (tokenMetadata?.standard === TokenStandard.BaseToken) {
        if (!selectedUnit || selectedUnit === tokenMetadata.unit) {
            return convertFloatToBigInt(amount, min)
        } else if (selectedUnit === tokenMetadata.subunit) {
            return BigInt(amount)
        } else {
            return undefined
        }
    } else if (tokenMetadata?.standard === TokenStandard.Irc30 || tokenMetadata?.standard === TokenStandard.Erc20) {
        return convertFloatToBigInt(amount, min)
    } else {
        throw new Error('convertToRawAmountFromMetadata: Invalid token standard')
    }
}

function bigIntMinAndMax(...args: number[]): [min: number, max: number] {
    return args.reduce(
        ([min, max], e) => {
            return [e < min ? e : min, e > max ? e : max]
        },
        [args[0], args[0]]
    )
}

function convertFloatToBigInt(amount: number, maxDecimals: number): bigint {
    const parts = amount.toString().split('.')
    const integerPart = parts[0]
    const decimalPart = parts[1] ?? ''
    const decimalPartPadded = decimalPart.padEnd(maxDecimals, '0')
    return BigInt(integerPart + decimalPartPadded)
}

import { parseCurrency } from '@core/i18n'
import Big from 'big.js'
import { TokenMetadata } from '@core/token/types'
import { TokenStandard } from '@core/token/enums'
import { MAX_SUPPORTED_DECIMALS } from '@core/wallet/constants'

export function convertToRawAmount(amount: string, tokenMetadata: TokenMetadata, unit?: string): Big | undefined {
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
): Big | undefined {
    if (tokenMetadata?.standard === TokenStandard.BaseToken) {
        if (!selectedUnit || selectedUnit === tokenMetadata.unit) {
            const decimals = Math.min(tokenMetadata.decimals, MAX_SUPPORTED_DECIMALS)
            return convertAmountToMatchUnit(amount, decimals)
        } else if (selectedUnit === tokenMetadata.subunit) {
            return Big(amount)
        } else {
            return undefined
        }
    } else if (tokenMetadata?.standard === TokenStandard.Irc30 || tokenMetadata?.standard === TokenStandard.Erc20) {
        const decimals = Math.min(tokenMetadata.decimals, MAX_SUPPORTED_DECIMALS)
        return convertAmountToMatchUnit(amount, decimals)
    } else {
        throw new Error('convertToRawAmountFromMetadata: Invalid token standard')
    }
}

function convertAmountToMatchUnit(amount: number, decimalsInUnit: number): Big {
    return Big(amount).mul(Big(10).pow(decimalsInUnit))
}

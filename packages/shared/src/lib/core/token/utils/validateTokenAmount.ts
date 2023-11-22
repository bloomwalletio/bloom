import { localize, parseCurrency } from '@core/i18n'
import { convertToRawAmount } from '@core/token'
import { TokenStandard } from '@core/token/enums'
import { ITokenWithBalance } from '@core/token/interfaces'
import Big from 'big.js'

export function validateTokenAmount(
    rawAmount: string,
    token: ITokenWithBalance,
    unit: string,
    allowZeroOrNull = false
): Promise<string> {
    if (rawAmount === undefined || token?.metadata === undefined) {
        return Promise.reject()
    }
    const isAmountZeroOrNull = !Number(rawAmount)
    const requiresRawAmount =
        (token.metadata.standard === TokenStandard.BaseToken && unit === token.metadata.subunit) ||
        token.metadata.decimals === 0
    console.log('rawAmount', rawAmount)
    const bigAmount = new Big(rawAmount)
    console.log('available', token?.balance.available)

    // Zero value transactions can still contain metadata/tags
    let error = ''
    if (allowZeroOrNull && isAmountZeroOrNull) {
        return Promise.resolve(Big(0).toString())
    } else if (isAmountZeroOrNull) {
        error = localize('error.send.amountInvalidFormat')
    } else if (requiresRawAmount && Number.parseInt(rawAmount, 10).toString() !== rawAmount) {
        error = localize('error.send.amountNoFloat')
    } else if (bigAmount.gt(Big(token?.balance?.available ?? 0))) {
        error = localize('error.send.amountTooHigh')
    } else if (bigAmount.lte(Big(0))) {
        error = localize('error.send.amountZero')
    } else if (!bigAmount.mod(1).eq(Big(0))) {
        error = localize('error.send.amountSmallerThanSubunit')
    }

    if (error) {
        return Promise.reject(error)
    }
    return Promise.resolve(bigAmount.toString())
}

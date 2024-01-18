import { AmountNotAnIntegerError, SendTransactionParameter } from '@auxiliary/deep-link'
import { BigIntAbs } from '@core/utils'

export function getRawAmountFromSearchParam(
    searchParams: URLSearchParams,
    parameterKey: SendTransactionParameter
): bigint {
    const rawAmount = searchParams.get(parameterKey) ?? '0'
    if (!new RegExp(/^[+|-]?\d+$/).test(rawAmount)) {
        throw new AmountNotAnIntegerError(rawAmount)
    }
    return BigIntAbs(rawAmount)
}

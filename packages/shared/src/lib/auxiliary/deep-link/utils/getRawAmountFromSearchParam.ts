import { AmountNotAnIntegerError, SendTransactionParameter } from '@auxiliary/deep-link'

export function getRawAmountFromSearchParam(
    searchParams: URLSearchParams,
    parameterKey: SendTransactionParameter
): bigint {
    const rawAmount = searchParams.get(parameterKey) ?? '0'
    if (!new RegExp(/^[+|-]?\d+$/).test(rawAmount)) {
        throw new AmountNotAnIntegerError(rawAmount)
    }
    let bigAmount = BigInt(rawAmount)
    if (bigAmount < 0) {
        bigAmount *= BigInt(-1)
    }
    return bigAmount
}

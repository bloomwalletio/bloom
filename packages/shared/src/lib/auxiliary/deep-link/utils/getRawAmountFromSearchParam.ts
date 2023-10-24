import { AmountNotAnIntegerError, SendTransactionParameter } from '@auxiliary/deep-link'

export function getRawAmountFromSearchParam(
    searchParams: URLSearchParams,
    parameterKey: SendTransactionParameter
): string {
    let rawAmount = searchParams.get(parameterKey)
    const amount = Number(rawAmount)
    if (!Number.isInteger(amount)) {
        throw new AmountNotAnIntegerError(rawAmount)
    }
    if (amount < 0) {
        rawAmount = Math.abs(amount).toString()
    }
    return rawAmount
}

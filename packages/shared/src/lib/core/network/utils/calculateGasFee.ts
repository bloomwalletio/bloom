import { Converter } from '@core/utils'
import { BigIntLike } from '@ethereumjs/util'

export function calculateGasFee(
    gasAmount: BigIntLike | null | undefined,
    gasPriceInWei: BigIntLike | null | undefined
): bigint {
    return Converter.bigIntLikeToBigInt(gasAmount ?? 0) * Converter.bigIntLikeToBigInt(gasPriceInWei ?? 0)
}

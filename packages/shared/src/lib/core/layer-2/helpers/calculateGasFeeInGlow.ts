import { BigIntLike } from '@ethereumjs/util'
import { Converter } from '@core/utils'
import { getEvmTransactionValueFromAmount } from './getEvmTransactionValueFromAmount'
import { NetworkType } from '@core/network'

export function calculateGasFeeInGlow(
    gasAmount: BigIntLike,
    gasPriceInWei: BigIntLike | undefined,
    networkType: NetworkType
): bigint {
    if (gasAmount && gasPriceInWei) {
        const totalPriceInWei = Converter.bigIntLikeToBigInt(gasAmount) * Converter.bigIntLikeToBigInt(gasPriceInWei)
        const totalPriceInGlow = getEvmTransactionValueFromAmount(totalPriceInWei, networkType)
        return totalPriceInGlow
    } else {
        return BigInt(0)
    }
}

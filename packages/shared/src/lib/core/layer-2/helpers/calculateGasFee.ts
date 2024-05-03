import { BigIntLike } from '@ethereumjs/util'
import { Converter } from '@core/utils'
import { getAmountFromEvmTransaction } from './getEvmAmount'
import { NetworkType } from '@core/network'

export function calculateGasFee(
    gasAmount: BigIntLike,
    gasPriceInWei: BigIntLike | undefined,
    networkType: NetworkType
): bigint {
    if (gasAmount && gasPriceInWei) {
        const totalPriceInWei = Converter.bigIntLikeToBigInt(gasAmount) * Converter.bigIntLikeToBigInt(gasPriceInWei)
        const totalPriceInGlow = getAmountFromEvmTransaction(totalPriceInWei, networkType)
        return totalPriceInGlow
    } else {
        return BigInt(0)
    }
}

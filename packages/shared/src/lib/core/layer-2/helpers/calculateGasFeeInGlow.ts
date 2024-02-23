import { BigIntLike } from '@ethereumjs/util'
import { WEI_PER_GLOW } from '../constants/wei.constants'
import { Converter } from '@core/utils'

export function calculateGasFeeInGlow(gasAmount: BigIntLike, gasPriceInWei: BigIntLike | undefined): bigint {
    if (gasAmount && gasPriceInWei) {
        const totalPriceInWei = Converter.bigIntLikeToBigInt(gasAmount) * Converter.bigIntLikeToBigInt(gasPriceInWei)
        const totalPriceInGlow = totalPriceInWei / WEI_PER_GLOW
        return totalPriceInGlow
    } else {
        return BigInt(0)
    }
}

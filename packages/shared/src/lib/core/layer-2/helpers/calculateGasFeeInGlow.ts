import { BigIntLike } from '@ethereumjs/util'
import { WEI_PER_GLOW } from '../constants/wei.constants'
import { Converter } from '@core/utils'

export function calculateGasFeeInGlow(gasAmount: BigIntLike, gasPriceInWei: BigIntLike | undefined): bigint {
    if (gasAmount && gasPriceInWei) {
        const gasPriceInGlow = BigInt(Number(gasPriceInWei)) / WEI_PER_GLOW
        return Converter.bigIntLikeToBigInt(gasAmount) * gasPriceInGlow
    } else {
        return BigInt(0)
    }
}

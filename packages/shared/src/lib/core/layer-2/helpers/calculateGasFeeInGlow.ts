import { BigIntLike } from '@ethereumjs/util'
import { WEI_PER_GLOW } from '../constants/wei.constants'

export function calculateGasFeeInGlow(gasAmount: BigIntLike, gasPriceInWei: BigIntLike | undefined): bigint {
    if (gasAmount && gasPriceInWei) {
        const gasPriceInGlow = BigInt(Number(gasPriceInWei)) / WEI_PER_GLOW
        return BigInt(Number(gasAmount) * Number(gasPriceInGlow))
    } else {
        return BigInt(0)
    }
}

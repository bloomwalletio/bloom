import { BigIntLike } from '@ethereumjs/util'
import { WEI_PER_GLOW } from '../constants'

export function calculateGasFeeInGlow(gasAmount: BigIntLike, gasFeeInWei: BigIntLike): string {
    const gasPriceInGlow = BigInt(Number(gasFeeInWei)) / WEI_PER_GLOW
    return BigInt(Number(gasAmount) * Number(gasPriceInGlow)).toString()
}

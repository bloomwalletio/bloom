import { HEX_PREFIX } from '@core/utils'
import { WEI_PER_GLOW } from '../constants'

export function getEvmTransactionValueFromAmount(amount: bigint): string {
    return HEX_PREFIX + BigInt(amount * WEI_PER_GLOW).toString(16)
}

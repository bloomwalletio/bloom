import { HEXADECIMAL_PREFIX } from '@core/utils'
import { WEI_PER_GLOW } from '../constants'

export function getEvmTransactionValueFromAmount(amount: number | string): string {
    return HEXADECIMAL_PREFIX + BigInt(BigInt(amount) * WEI_PER_GLOW).toString(16)
}

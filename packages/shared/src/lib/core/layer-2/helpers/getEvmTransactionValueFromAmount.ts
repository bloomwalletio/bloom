import { WEI_PER_GLOW } from '../constants'

export function getEvmTransactionValueFromAmount(amount: number | string): string {
    return '0x' + BigInt(BigInt(amount) * WEI_PER_GLOW).toString(16)
}

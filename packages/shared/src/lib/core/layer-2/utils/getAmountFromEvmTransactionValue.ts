import { WEI_PER_GLOW } from '../constants'

export function getAmountFromEvmTransactionValue(value: string): number {
    const rawAmount = (BigInt(value) / WEI_PER_GLOW).toString(10)
    return parseInt(rawAmount) / 1_000_000
}

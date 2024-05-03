import { NetworkType } from '@core/network/enums'

const WEI_PER_GLOW = BigInt(1_000_000_000_000)

export function getAmountForEvmTransaction(amount: bigint, networkType: NetworkType): bigint {
    return networkType === NetworkType.Isc ? amount * WEI_PER_GLOW : amount
}

export function getAmountFromEvmTransaction(amount: bigint, networkType: NetworkType): bigint {
    return networkType === NetworkType.Isc ? amount / WEI_PER_GLOW : amount
}

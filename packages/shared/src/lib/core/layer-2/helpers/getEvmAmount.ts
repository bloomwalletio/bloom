import { NetworkType } from '@core/network/enums'
import { Converter } from '@core/utils'
import { BigIntLike } from '@ethereumjs/util'

const WEI_PER_GLOW = BigInt(1_000_000_000_000)

export function getAmountForEvmTransaction(amount: BigIntLike, networkType: NetworkType): bigint {
    return networkType === NetworkType.Isc
        ? Converter.bigIntLikeToBigInt(amount) * WEI_PER_GLOW
        : Converter.bigIntLikeToBigInt(amount)
}

export function getAmountFromEvmTransaction(amount: BigIntLike, networkType: NetworkType): bigint {
    return networkType === NetworkType.Isc
        ? Converter.bigIntLikeToBigInt(amount) / WEI_PER_GLOW
        : Converter.bigIntLikeToBigInt(amount)
}

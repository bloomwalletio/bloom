const WEI_PER_GWEI = 1000000000

export function convertGweiToWei(gwei: number): bigint {
    return BigInt(Math.round(gwei * WEI_PER_GWEI))
}

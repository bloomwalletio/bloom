import { WEI_PER_GWEI } from '../constants'

export function convertGweiToWei(gwei: number): bigint {
    return BigInt(gwei * WEI_PER_GWEI)
}

import { INativeTokenAmount } from './native-token-amount.interface'

export interface IAssetAllowance {
    baseTokens: string | number
    nativeTokens: INativeTokenAmount[]
    nfts: string[]
}

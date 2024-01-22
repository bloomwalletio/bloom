import { INativeTokenAmount } from './native-token-amount.interface'

export interface ILayer2AssetAllowance {
    baseTokens: string
    nativeTokens: INativeTokenAmount[]
    nfts: string[]
}

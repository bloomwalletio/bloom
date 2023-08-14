import { NativeTokenAmount } from '@core/token/types'

export interface ILayer2AssetAllowance {
    baseTokens: string
    nativeTokens: NativeTokenAmount[]
    nfts: string[]
}

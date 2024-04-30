import { NetworkId } from '@core/network'
import { ITokenWithBalance } from '..'

export type AccountTokens = {
    [networkId in NetworkId]?: IAccountTokensPerNetwork
}

export interface IAccountTokensPerNetwork {
    baseCoin: ITokenWithBalance
    nativeTokens: ITokenWithBalance[]
}

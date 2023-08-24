import { NetworkId } from '@core/network'
import { IToken } from './token.interface'

export type AccountTokens = {
    [networkId in NetworkId]?: IAccountTokensPerNetwork
}

export interface IAccountTokensPerNetwork {
    baseCoin: IToken | undefined
    nativeTokens: IToken[]
}

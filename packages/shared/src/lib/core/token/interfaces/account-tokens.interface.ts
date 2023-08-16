import { IToken } from './token.interface'

export type AccountTokens = {
    // [networkId: string] | [chainId: number]
    [id: number | string]: IAccountTokensPerNetwork
}

export interface IAccountTokensPerNetwork {
    baseCoin: IToken | undefined
    nativeTokens: IToken[]
}

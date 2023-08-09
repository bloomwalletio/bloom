import { IToken } from '@core/token/interfaces'

export type AccountTokens = {
    // [networkId: string] | [chainId: number]
    [id: number | string]: IAccountTokensPerNetwork
}

export interface IAccountTokensPerNetwork {
    baseCoin: IToken | undefined
    nativeTokens: IToken[]
}

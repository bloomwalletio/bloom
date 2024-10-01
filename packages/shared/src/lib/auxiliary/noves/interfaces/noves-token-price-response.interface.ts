import { NovesToken } from './noves-token.interface'

export interface NovesTokenPriceResponse {
    chain: string
    block: string
    token: NovesToken
    price: TokenPrice
    pricedBy: PricedBy | null
    priceType: string
    priceStatus: string
}

interface TokenPrice {
    amount: string | null
    currency: string | null
    status: string
}

interface PricedBy {
    poolAddress: string
    exchange: Exchange
    liquidity: number
    baseToken: NovesToken
}

interface Exchange {
    name: string
}

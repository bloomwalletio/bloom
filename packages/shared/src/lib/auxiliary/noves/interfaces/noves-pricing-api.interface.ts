import { NovesTokenPriceResponse } from './noves-token-price-response.interface'

export interface INovesPricingApi {
    getTokenPrice(tokenAddress: string, chain: string): Promise<NovesTokenPriceResponse | undefined>
}

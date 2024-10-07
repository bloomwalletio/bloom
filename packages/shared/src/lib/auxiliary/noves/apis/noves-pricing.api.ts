import { NovesTokenPriceResponse } from '../interfaces'
import { NovesBaseApi } from './noves-base.api'

export class NovesPricingApi extends NovesBaseApi {
    constructor() {
        super('https://pricing.noves.fi')
    }

    async getTokenPrice(tokenAddress: string, chain: string): Promise<NovesTokenPriceResponse | undefined> {
        const response = await this.get<NovesTokenPriceResponse>({
            path: `${chain}/price/${tokenAddress}`,
        })
        return response
    }
}

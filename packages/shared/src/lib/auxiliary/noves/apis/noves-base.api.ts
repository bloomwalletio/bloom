import { BaseApi, IRequestParams } from '@core/utils'
import { SupportedChain } from '../interfaces'

export class NovesBaseApi extends BaseApi {
    protected get<T>(params: Omit<IRequestParams, 'body'>): Promise<T | undefined> {
        return this.makeRequest<T>({
            ...params,
            headers: {
                apiKey: process.env.NOVES_API_KEY ?? 'demokey',
            },
        })
    }

    protected post<T>(params: IRequestParams): Promise<T | undefined> {
        return this.makeRequest<T>({
            ...params,
            headers: {
                apiKey: process.env.NOVES_API_KEY ?? 'demokey',
            },
        })
    }

    async getSupportedEvmChains(): Promise<SupportedChain[]> {
        const response = await this.get<SupportedChain[]>({ path: 'evm/chains' })
        return response ?? []
    }
}

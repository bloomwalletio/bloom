import { NovesForesightDescribeResponse, NovesTransaction } from '../interfaces'
import { NovesBaseApi } from './noves-base.api'

export class NovesForesightApi extends NovesBaseApi {
    constructor() {
        super('https://foresight.noves.fi')
    }

    async previewTransaction(
        chain: string,
        transaction: NovesTransaction,
        viewAsAccountAddress?: string,
        blockNumber?: number
    ): Promise<unknown | undefined> {
        const response = await this.post<unknown>({
            path: `evm/${chain}/preview`,
            body: JSON.stringify(transaction),
            queryParameters: {
                ...(viewAsAccountAddress ? { viewAsAccountAddress } : {}),
                ...(blockNumber ? { blockNumber } : {}),
            },
        })
        return response
    }

    async describeTransaction(
        chain: string,
        transaction: NovesTransaction
    ): Promise<NovesForesightDescribeResponse | undefined> {
        const response = await this.post<NovesForesightDescribeResponse>({
            path: `evm/${chain}/describe`,
            body: JSON.stringify(transaction),
        })
        return response
    }
}

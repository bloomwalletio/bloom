import { QueryParameters } from '@core/utils'
import {
    NovesHistoryOptions,
    NovesHistoryResponse,
    NovesTxDescriptionResponse,
    NovesTxResponse,
    NovesTxsOptions,
    NovesTxsResponse,
} from '../interfaces'
import { NovesBaseApi } from './noves-base.api'
import { NovesTokenBalancesResponse } from '../types'

export class NovesTranslateApi extends NovesBaseApi {
    constructor() {
        super('https://translate.noves.fi')
    }

    async getTransaction(
        txHash: string,
        chain: string,
        viewAsAccountAddress?: string
    ): Promise<NovesTxResponse | undefined> {
        const response = await this.get<NovesTxResponse>({
            path: `evm/${chain}/tx/${txHash}`,
            queryParameters: viewAsAccountAddress ? { viewAsAccountAddress } : {},
        })
        return response
    }

    async describeTransaction(txHash: string, chain: string): Promise<NovesTxDescriptionResponse | undefined> {
        const response = await this.get<NovesTxDescriptionResponse>({ path: `evm/${chain}/describeTx/${txHash}` })
        return response
    }

    async getTransactionsFromAddress(
        accountAddress: string,
        chain: string,
        options: NovesTxsOptions
    ): Promise<NovesTxsResponse | undefined> {
        const response = await this.get<NovesTxsResponse>({
            path: `evm/${chain}/txs/${accountAddress}`,
            queryParameters: options as QueryParameters,
        })
        return response
    }

    async getHistoryFromAddress(
        accountAddress: string,
        chain: string,
        options: NovesHistoryOptions
    ): Promise<NovesHistoryResponse | undefined> {
        const response = await this.get<NovesHistoryResponse>({
            path: `evm/${chain}/history/${accountAddress}`,
            queryParameters: options as QueryParameters,
        })
        return response
    }

    async getTokenBalancesFromAddress(
        accountAddress: string,
        chain: string,
        tokensHashes: string[],
        blockNumber?: number
    ): Promise<NovesTokenBalancesResponse | undefined> {
        const response = await this.post<NovesTokenBalancesResponse>({
            path: `/evm/${chain}/tokens/balancesOf/${accountAddress}`,
            body: JSON.stringify(tokensHashes),
            queryParameters: blockNumber ? { blockNumber } : {},
        })
        return response
    }
}

import { NovesTokenBalancesResponse } from '../types'
import { NovesHistoryItem } from './noves-history-response.interface'
import { NovesTxDescriptionResponse } from './noves-tx-description-response.interface'
import { NovesTxResponse } from './noves-tx-response.interface'
import { NovesTxsResponse } from './noves-txs-response.interface'

export interface INovesTranslateApi {
    getTransaction(txHash: string, chain: string, viewAsAccountAddress?: string): Promise<NovesTxResponse | undefined>
    describeTransaction(txHash: string, chain: string): Promise<NovesTxDescriptionResponse | undefined>
    getTransactionsFromAddress(
        accountAddress: string,
        chain: string,
        options?: NovesTxsOptions
    ): Promise<NovesTxsResponse | undefined>
    getHistoryFromAddress(
        accountAddress: string,
        chain: string,
        options?: NovesHistoryOptions
    ): Promise<NovesHistoryItem[]>
    getTokenBalancesFromAddress(
        accountAddress: string,
        chain: string,
        tokensHashes: string[],
        blockNumber?: number
    ): Promise<NovesTokenBalancesResponse | undefined>
}

export interface NovesHistoryOptions {
    viewAsAccountAddress?: string
    startTimestamp?: number
    endTimestamp?: number
    startBlock?: number
    endBlock?: number
    sort?: 'asc' | 'desc' // defaults to desc
    pageSize?: number
    liveData?: boolean // defaults to false
}

export interface NovesTxsOptions extends NovesHistoryOptions {
    viewAsAccountAddress?: string
}

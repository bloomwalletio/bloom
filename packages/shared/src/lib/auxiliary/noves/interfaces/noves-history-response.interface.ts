import { NovesPagination } from './noves-pagination.interface'

export interface NovesHistoryResponse extends NovesPagination {
    items: NovesHistoryItem[]
}

export interface NovesHistoryItem {
    transactionHash: string
    blockNumber: string
    timestamp: number
}

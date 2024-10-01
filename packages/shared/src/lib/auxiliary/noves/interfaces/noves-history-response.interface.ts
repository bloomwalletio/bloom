import { NovesPagination } from './noves-pagination.interface'

export interface NovesHistoryResponse extends NovesPagination {
    items: NovesHistoryItem[]
}

interface NovesHistoryItem {
    transactionHash: string
    blockNumber: string
    timestamp: number
}

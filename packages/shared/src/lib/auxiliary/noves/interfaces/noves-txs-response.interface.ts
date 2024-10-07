import { NovesPagination } from './noves-pagination.interface'
import { NovesTxResponse } from './noves-tx-response.interface'

export interface NovesTxsResponse extends NovesPagination {
    items: NovesTxResponse[]
}

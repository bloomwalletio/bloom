import { NovesForesightDescribeResponse } from './noves-foresight-describe-response.interface'
import { NovesTransaction } from './noves-transaction.interface'

export interface INovesForesightApi {
    previewTransaction(
        chain: string,
        transaction: NovesTransaction,
        viewAsAccountAddress?: string,
        blockNumber?: number
    ): Promise<unknown | undefined>
    describeTransaction(
        chain: string,
        transaction: NovesTransaction
    ): Promise<NovesForesightDescribeResponse | undefined>
}

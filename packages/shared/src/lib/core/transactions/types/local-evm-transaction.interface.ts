import { EvmTransactionData } from '@core/layer-2/types'

export type LocalEvmTransaction = EvmTransactionData & {
    status: boolean
    transactionHash: string
    transactionIndex: number
    blockNumber: number
    to: string
    from: string
    gasUsed: number
}

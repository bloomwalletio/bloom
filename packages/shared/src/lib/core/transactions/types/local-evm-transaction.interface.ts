import { EvmTransactionData } from '@core/layer-2/types'

// estimatedGas, gasLimit and nonce has to be a `number` instead of `biging` because bigints cannot be stored in local storage
export type LocalEvmTransaction = Omit<EvmTransactionData, 'estimatedGas' | 'gasLimit' | 'nonce'> & {
    status: boolean
    transactionHash: string
    transactionIndex?: number
    blockNumber?: number
    timestamp: number
    to: string
    from: string
    gasUsed?: number
    estimatedGas?: number
    gasLimit?: number
    nonce?: number
    confirmations?: number
    recipient?: string
}

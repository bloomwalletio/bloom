import { Output } from '@core/wallet/types'
import { EvmTransactionData } from '@core/layer-2/types'

export type TransactionSummaryProps = {
    _onMount: ((..._: unknown[]) => Promise<void>) | undefined
    preparedOutput: Output | undefined
    preparedTransaction: EvmTransactionData | undefined
}

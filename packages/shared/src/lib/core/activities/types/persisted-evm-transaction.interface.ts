import { EvmTransactionData } from '@core/layer-2'
import { TransactionReceipt } from 'web3-core'

export type PersistedEvmTransaction = TransactionReceipt & EvmTransactionData

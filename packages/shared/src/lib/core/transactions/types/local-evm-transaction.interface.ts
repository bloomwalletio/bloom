import { EvmTransactionData } from '@core/layer-2/types'
import { TransactionReceipt } from 'web3-core'

export type LocalEvmTransaction = TransactionReceipt & EvmTransactionData

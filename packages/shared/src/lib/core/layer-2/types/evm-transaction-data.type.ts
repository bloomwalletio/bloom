import type { TxData } from '@ethereumjs/tx'

export type EvmTransactionData = TxData & { estimatedGas?: number; timestamp?: number }

import type { TypedTxData } from '@ethereumjs/tx'

export type EvmTransactionData = TypedTxData & { estimatedGas?: number; timestamp?: number }

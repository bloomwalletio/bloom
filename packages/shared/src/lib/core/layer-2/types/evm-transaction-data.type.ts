import type { TypedTxData } from '@ethereumjs/tx'

export type EvmTransactionData = TypedTxData & { estimatedGas?: bigint; timestamp?: number }

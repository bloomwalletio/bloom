import { TransactionOptions } from '@iota/sdk'

export const DEFAULT_TRANSACTION_OPTIONS: TransactionOptions = {
    remainderValueStrategy: { strategy: 'ReuseAddress', value: null },
    allowMicroAmount: true,
}

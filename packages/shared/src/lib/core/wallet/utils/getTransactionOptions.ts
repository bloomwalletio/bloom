import { TransactionOptions } from '@iota/sdk/out/types'

export function getTransactionOptions(remainderAddress: string): TransactionOptions {
    return {
        remainderValueStrategy: {
            strategy: 'CustomAddress',
            value: { address: remainderAddress, keyIndex: 0, internal: false, used: true },
        },
        allowMicroAmount: true,
    }
}

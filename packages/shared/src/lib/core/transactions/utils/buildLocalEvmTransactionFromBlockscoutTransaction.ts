import { BlockscoutTransactionStatus, IBlockscoutTransaction } from '@auxiliary/blockscout'
import { TransactionType } from '@ethereumjs/tx'
import { LocalEvmTransaction } from '../types'

export function buildPersistedEvmTransactionFromBlockscoutTransaction(
    blockscoutTransaction: IBlockscoutTransaction
): LocalEvmTransaction {
    return {
        status: blockscoutTransaction.status === BlockscoutTransactionStatus.Ok,
        transactionHash: blockscoutTransaction.hash,
        transactionIndex: blockscoutTransaction.position,
        blockNumber: blockscoutTransaction.block,
        from: blockscoutTransaction.from.hash.toLowerCase(),
        to: blockscoutTransaction.to.hash.toLowerCase(),
        gasUsed: Number(blockscoutTransaction.gas_used),
        type: TransactionType.Legacy,
        ...(blockscoutTransaction.nonce && { nonce: blockscoutTransaction.nonce }),
        ...(blockscoutTransaction.gas_price && { gasPrice: blockscoutTransaction.gas_price }),
        ...(blockscoutTransaction.gas_limit && { gasLimit: blockscoutTransaction.gas_limit }),
        ...(blockscoutTransaction.value && { value: blockscoutTransaction.value }),
        ...(blockscoutTransaction.raw_input &&
            blockscoutTransaction.raw_input !== '0x' && { data: blockscoutTransaction.raw_input }), // Not sure if this is the right field
        ...(blockscoutTransaction.timestamp && { timestamp: new Date(blockscoutTransaction.timestamp).getTime() }),
    }
}

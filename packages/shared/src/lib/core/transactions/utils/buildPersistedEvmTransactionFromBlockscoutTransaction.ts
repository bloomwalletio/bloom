import { IBlockscoutTransaction, BlockscoutTransactionStatus } from '@auxiliary/blockscout'
import { PersistedEvmTransaction } from '@core/activity'
import { LegacyTxData, TransactionType } from '@ethereumjs/tx'
import { TransactionReceipt } from 'web3-core'

export function buildPersistedEvmTransactionFromBlockscoutTransaction(
    blockscoutTransaction: IBlockscoutTransaction
): PersistedEvmTransaction {
    const transactionReceipt: TransactionReceipt = {
        status: blockscoutTransaction.status === BlockscoutTransactionStatus.Ok ? true : false,
        transactionHash: blockscoutTransaction.hash,
        transactionIndex: blockscoutTransaction.position,
        blockHash: '', // Unknown
        blockNumber: blockscoutTransaction.block,
        from: blockscoutTransaction.from.hash,
        to: blockscoutTransaction.to.hash,
        // contractAddress?: string,
        cumulativeGasUsed: Number(blockscoutTransaction.gas_used), // Not sure if this is the right field
        gasUsed: Number(blockscoutTransaction.gas_used),
        effectiveGasPrice: Number(blockscoutTransaction.gas_price),
        logs: [],
        logsBloom: '',
        // events?: {
        //     [eventName: string]: EventLog,
        // },
    }

    const transactionData: LegacyTxData & { estimatedGas?: number; timestamp?: number } = {
        type: TransactionType.Legacy,
        ...(blockscoutTransaction.nonce && { nonce: blockscoutTransaction.nonce }),
        ...(blockscoutTransaction.gas_price && { gasPrice: blockscoutTransaction.gas_price }),
        ...(blockscoutTransaction.gas_limit && { gasLimit: blockscoutTransaction.gas_limit }),
        // to?: AddressLike, // already set in transactionReceipt
        ...(blockscoutTransaction.value && { value: blockscoutTransaction.value }),
        ...(blockscoutTransaction.raw_input &&
            blockscoutTransaction.raw_input !== '0x' && { data: blockscoutTransaction.raw_input }), // Not sure if this is the right field

        // estimatedGas?: number, // No way to know this for fetched transactions
        ...(blockscoutTransaction.timestamp && { timestamp: new Date(blockscoutTransaction.timestamp).getTime() }),
    }
    return {
        ...transactionReceipt,
        ...transactionData,
    } as PersistedEvmTransaction
}

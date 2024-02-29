import { BlockscoutTransactionStatus, IBlockscoutTransaction } from '@auxiliary/blockscout'
import { IAccountState } from '@core/account/interfaces'
import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
import { IChain } from '@core/network'
import { PersistedTransaction } from '@core/transactions/stores'
import { LegacyTxData, TransactionType } from '@ethereumjs/tx'
import { TransactionReceipt } from 'web3-core'
import { ActivityType } from '../enums'
import { Activity, PersistedEvmTransaction } from '../types'
import { generateNftActivity } from './evm/generateNftActivity'
import { generateSmartContractActivity } from './evm/generateSmartContractActivity'
import { generateTokenActivity } from './evm/generateTokenActivity'

export async function generateActivityFromPersistedTransaction(
    persistedTransaction: PersistedTransaction,
    chain: IChain,
    account: IAccountState
): Promise<Activity | undefined> {
    const transaction = persistedTransaction.blockscout
        ? buildPersistedEvmTransactionFromBlockscoutTransaction(persistedTransaction.blockscout)
        : (persistedTransaction.local as PersistedEvmTransaction)
    const transferInfo = getTransferInfoFromTransactionData(transaction, chain)
    if (transferInfo?.type === ActivityType.SmartContract) {
        return generateSmartContractActivity(transaction, chain, account)
    } else if (transferInfo?.type === ActivityType.Basic) {
        const { tokenId, rawAmount, additionalBaseTokenAmount, recipientAddress } = transferInfo
        return generateTokenActivity(
            transaction,
            chain,
            tokenId,
            rawAmount,
            additionalBaseTokenAmount,
            recipientAddress,
            account
        )
    } else if (transferInfo?.type === ActivityType.Nft) {
        const { nftId, additionalBaseTokenAmount, recipientAddress } = transferInfo
        return generateNftActivity(transaction, chain, nftId, additionalBaseTokenAmount, recipientAddress, account)
    }
}

function buildPersistedEvmTransactionFromBlockscoutTransaction(
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
        // to?: AddressLike,
        ...(blockscoutTransaction.value && { value: blockscoutTransaction.value }),
        ...(blockscoutTransaction.raw_input && { data: blockscoutTransaction.raw_input }), // Not sure if this is the right field
        // estimatedGas?: number,
        ...(blockscoutTransaction.timestamp && { timestamp: new Date(blockscoutTransaction.timestamp).getTime() }),
    }
    return {
        ...transactionReceipt,
        ...transactionData,
    } as PersistedEvmTransaction
}

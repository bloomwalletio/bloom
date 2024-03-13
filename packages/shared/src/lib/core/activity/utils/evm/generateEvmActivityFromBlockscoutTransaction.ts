import { BlockscoutTransactionType, IBlockscoutTransaction } from '@auxiliary/blockscout'
import { IAccountState } from '@core/account'
import { IChain } from '@core/network'
import { LocalEvmTransaction, buildPersistedEvmTransactionFromBlockscoutTransaction } from '@core/transactions'
import { generateEvmActivityFromLocalEvmTransaction } from './generateEvmActivityFromLocalEvmTransaction'
import { EvmActivity, EvmCoinTransferActivity } from '@core/activity/types'
import { BASE_TOKEN_ID } from '@core/token'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'
import { EvmActivityType } from '@core/activity/enums/evm'
import { Converter } from '@core/utils'
import { EvmContractCallActivity } from '@core/activity/types/evm/evm-contract-call-activity.type'

export async function generateEvmActivityFromBlockscoutTransaction(
    blockscoutTransaction: IBlockscoutTransaction,
    localTransaction: LocalEvmTransaction | undefined,
    chain: IChain,
    account: IAccountState
): Promise<EvmActivity | undefined> {
    if (blockscoutTransaction.tx_types.includes(BlockscoutTransactionType.CoinTransfer)) {
        return generateEvmCoinTransferActivityFromBlockscoutTransaction(
            blockscoutTransaction,
            localTransaction,
            chain,
            account
        )
    } else if (blockscoutTransaction.tx_types.includes(BlockscoutTransactionType.TokenTransfer)) {
        // if it is a blockscout transaction and a token transfer we have already generated this activity
        // there may be cases where thats not the case but we are unsure so we plan to add a fallback here at a lower priority
        return undefined
    } else if (blockscoutTransaction.tx_types.includes(BlockscoutTransactionType.ContractCall)) {
        return generateEvmContractCallActivityFromBlockscoutTransaction(
            blockscoutTransaction,
            localTransaction,
            chain,
            account
        )
    } else {
        const localTransaction = buildPersistedEvmTransactionFromBlockscoutTransaction(blockscoutTransaction)
        return generateEvmActivityFromLocalEvmTransaction(localTransaction, chain, account)
    }
}

async function generateEvmContractCallActivityFromBlockscoutTransaction(
    blockscoutTransaction: IBlockscoutTransaction,
    localTransaction: LocalEvmTransaction | undefined,
    chain: IChain,
    account: IAccountState
): Promise<EvmContractCallActivity> {
    const baseActivity = await generateBaseEvmActivity(
        {
            to: blockscoutTransaction.to.hash.toLowerCase(),
            from: blockscoutTransaction.from.hash.toLowerCase(),
            gasUsed: Number(blockscoutTransaction.gas_used),
            estimatedGas: localTransaction?.estimatedGas,
            gasPrice: blockscoutTransaction.gas_price,
            transactionHash: blockscoutTransaction.hash,
            timestamp: new Date(blockscoutTransaction.timestamp).getTime(),
            blockNumber: blockscoutTransaction.block,
        },
        chain,
        blockscoutTransaction.to.hash.toLowerCase(),
        account
    )

    return {
        ...baseActivity,
        type: EvmActivityType.ContractCall,
        verified: blockscoutTransaction.to.is_verified,
        methodId: blockscoutTransaction.decoded_input?.method_id,
        method: blockscoutTransaction.method,
        parameters: blockscoutTransaction.decoded_input?.parameters,
        rawData: blockscoutTransaction.raw_input,
    } as EvmContractCallActivity
}

async function generateEvmCoinTransferActivityFromBlockscoutTransaction(
    blockscoutTransaction: IBlockscoutTransaction,
    localTransaction: LocalEvmTransaction | undefined,
    chain: IChain,
    account: IAccountState
): Promise<EvmCoinTransferActivity> {
    const baseActivity = await generateBaseEvmActivity(
        {
            to: blockscoutTransaction.to.hash.toLowerCase(),
            from: blockscoutTransaction.from.hash.toLowerCase(),
            gasUsed: Number(blockscoutTransaction.gas_used),
            estimatedGas: localTransaction?.estimatedGas,
            gasPrice: blockscoutTransaction.gas_price,
            transactionHash: blockscoutTransaction.hash,
            timestamp: new Date(blockscoutTransaction.timestamp).getTime(),
            blockNumber: blockscoutTransaction.block,
        },
        chain,
        blockscoutTransaction.to.hash.toLowerCase(),
        account
    )

    return {
        ...baseActivity,
        type: EvmActivityType.CoinTransfer,
        baseTokenTransfer: {
            tokenId: BASE_TOKEN_ID,
            rawAmount: Converter.bigIntLikeToBigInt(blockscoutTransaction.value),
        },
    } as EvmCoinTransferActivity
}

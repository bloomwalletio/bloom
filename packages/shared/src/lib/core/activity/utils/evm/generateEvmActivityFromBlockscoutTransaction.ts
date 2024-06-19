import { BlockscoutTransactionType, IBlockscoutTransaction } from '@auxiliary/blockscout'
import { IAccountState } from '@core/account'
import { IEvmNetwork } from '@core/network'
import { LocalEvmTransaction, buildPersistedEvmTransactionFromBlockscoutTransaction } from '@core/transactions'
import { generateEvmActivityFromLocalEvmTransaction } from './generateEvmActivityFromLocalEvmTransaction'
import {
    BaseEvmActivity,
    EvmActivity,
    EvmCoinTransferActivity,
    EvmTokenApprovalActivity,
    EvmTokenTransferActivity,
} from '@core/activity/types'
import { BASE_TOKEN_ID } from '@core/token'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'
import { EvmActivityType } from '@core/activity/enums/evm'
import { Converter } from '@core/utils'
import { EvmContractCallActivity } from '@core/activity/types/evm/evm-contract-call-activity.type'
import { SubjectType } from '@core/wallet'
import { ActivityDirection } from '@core/activity/enums'
import { getSmartContractDataFromBlockscoutTransaction } from './getSmartContractDataFromBlockscoutTransaction'

export async function generateEvmActivityFromBlockscoutTransaction(
    blockscoutTransaction: IBlockscoutTransaction,
    localTransaction: LocalEvmTransaction | undefined,
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<EvmActivity | undefined> {
    if (
        blockscoutTransaction.tx_types.includes(BlockscoutTransactionType.TokenTransfer) ||
        blockscoutTransaction.tx_types.includes(BlockscoutTransactionType.TokenMinting)
    ) {
        // if it is a blockscout transaction and a token transfer we have already generated this activity
        // there may be cases where thats not the case but we are unsure so we plan to add a fallback here at a lower priority
        return undefined
    } else if (blockscoutTransaction.tx_types.includes(BlockscoutTransactionType.CoinTransfer)) {
        return generateEvmCoinTransferActivityFromBlockscoutTransaction(
            blockscoutTransaction,
            localTransaction,
            evmNetwork,
            account
        )
    } else if (blockscoutTransaction.tx_types.includes(BlockscoutTransactionType.ContractCall)) {
        return generateEvmContractCallActivityFromBlockscoutTransaction(
            blockscoutTransaction,
            localTransaction,
            evmNetwork,
            account
        )
    } else {
        const localTransaction = buildPersistedEvmTransactionFromBlockscoutTransaction(blockscoutTransaction)
        return generateEvmActivityFromLocalEvmTransaction(localTransaction, evmNetwork, account)
    }
}

async function generateEvmContractCallActivityFromBlockscoutTransaction(
    blockscoutTransaction: IBlockscoutTransaction,
    localTransaction: LocalEvmTransaction | undefined,
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<EvmActivity> {
    const baseActivity = await generateBaseEvmActivityFromBlockscoutTransaction(
        blockscoutTransaction,
        localTransaction,
        evmNetwork,
        account
    )

    const methodId = blockscoutTransaction.decoded_input?.method_id ?? blockscoutTransaction.method // `method` is the methodId if the inputs cannot be decoded
    const rawData = blockscoutTransaction.raw_input

    const smartContractData = blockscoutTransaction
        ? getSmartContractDataFromBlockscoutTransaction(blockscoutTransaction, evmNetwork)
        : undefined

    switch (smartContractData?.type) {
        case EvmActivityType.CoinTransfer:
            return {
                ...baseActivity,
                type: EvmActivityType.CoinTransfer,
                baseTokenTransfer: smartContractData.baseTokenTransfer,
                methodId,
                method: smartContractData.method,
                inputs: smartContractData.inputs,
            } as EvmCoinTransferActivity
        case EvmActivityType.TokenTransfer:
            return {
                ...baseActivity,
                type: EvmActivityType.TokenTransfer,
                tokenTransfer: smartContractData.tokenTransfer,
                methodId,
                method: smartContractData.method,
                inputs: smartContractData.inputs,
            } as EvmTokenTransferActivity
        case EvmActivityType.TokenApproval:
            return {
                ...baseActivity,
                type: EvmActivityType.TokenApproval,
                tokenTransfer: smartContractData.tokenTransfer,
                methodId,
                method: smartContractData.method,
                inputs: smartContractData.inputs,
                direction: ActivityDirection.SelfTransaction,
            } as EvmTokenApprovalActivity
        case EvmActivityType.ContractCall:
        default:
            return {
                ...baseActivity,
                type: EvmActivityType.ContractCall,
                rawData,
                methodId,
                method: smartContractData?.method,
                inputs: smartContractData?.inputs,
            } as EvmContractCallActivity
    }
}

async function generateEvmCoinTransferActivityFromBlockscoutTransaction(
    blockscoutTransaction: IBlockscoutTransaction,
    localTransaction: LocalEvmTransaction | undefined,
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<EvmCoinTransferActivity> {
    const baseActivity = await generateBaseEvmActivityFromBlockscoutTransaction(
        blockscoutTransaction,
        localTransaction,
        evmNetwork,
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

async function generateBaseEvmActivityFromBlockscoutTransaction(
    blockscoutTransaction: IBlockscoutTransaction,
    localTransaction: LocalEvmTransaction | undefined,
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<BaseEvmActivity> {
    const newLocalTransaction: LocalEvmTransaction = {
        recipient: blockscoutTransaction.to.hash.toLowerCase(),
        from: blockscoutTransaction.from.hash.toLowerCase(),
        gasUsed: Number(blockscoutTransaction.gas_used),
        gasPrice: blockscoutTransaction.gas_price,
        transactionHash: blockscoutTransaction.hash,
        timestamp: new Date(blockscoutTransaction.timestamp).getTime(),
        blockNumber: blockscoutTransaction.block,
        confirmations: blockscoutTransaction.confirmations,
        status: localTransaction?.status ?? false,
        transactionIndex: localTransaction?.transactionIndex ?? 0,
        to: localTransaction?.to ?? blockscoutTransaction.to.hash.toLowerCase(),
    }
    const baseActivity = await generateBaseEvmActivity(newLocalTransaction, evmNetwork, account)

    if (blockscoutTransaction.to.is_contract) {
        baseActivity.recipient = {
            type: SubjectType.SmartContract,
            address: blockscoutTransaction.to.hash.toLowerCase(),
            name: blockscoutTransaction.to.name ?? '',
            verified: blockscoutTransaction.to.is_verified,
        }
        baseActivity.contract = structuredClone(baseActivity.recipient)
    }
    if (blockscoutTransaction.from.is_contract) {
        baseActivity.sender = {
            type: SubjectType.SmartContract,
            address: blockscoutTransaction.from.hash.toLowerCase(),
            name: blockscoutTransaction.from.name ?? '',
            verified: blockscoutTransaction.from.is_verified,
        }
        baseActivity.contract = structuredClone(baseActivity.sender)
    }
    baseActivity.subject =
        baseActivity.direction === ActivityDirection.Outgoing ? baseActivity.recipient : baseActivity.sender

    return baseActivity
}

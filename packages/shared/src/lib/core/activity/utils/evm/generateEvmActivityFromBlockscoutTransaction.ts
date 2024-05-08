import { BlockscoutTransactionType, IBlockscoutTransaction } from '@auxiliary/blockscout'
import { IAccountState } from '@core/account'
import { IEvmNetwork } from '@core/network'
import { LocalEvmTransaction, buildPersistedEvmTransactionFromBlockscoutTransaction } from '@core/transactions'
import { generateEvmActivityFromLocalEvmTransaction } from './generateEvmActivityFromLocalEvmTransaction'
import { BaseEvmActivity, EvmActivity, EvmCoinTransferActivity } from '@core/activity/types'
import { BASE_TOKEN_ID } from '@core/token'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'
import { EvmActivityType } from '@core/activity/enums/evm'
import { Converter, HEX_PREFIX } from '@core/utils'
import { EvmContractCallActivity } from '@core/activity/types/evm/evm-contract-call-activity.type'
import { SubjectType } from '@core/wallet'
import { ActivityDirection } from '@core/activity/enums'
import { getMethodForEvmTransaction } from '@core/layer-2'
import { addMethodToRegistry, getMethodFromRegistry } from '@core/layer-2/stores/method-registry.store'

export async function generateEvmActivityFromBlockscoutTransaction(
    blockscoutTransaction: IBlockscoutTransaction,
    localTransaction: LocalEvmTransaction | undefined,
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<EvmActivity | undefined> {
    if (blockscoutTransaction.tx_types.includes(BlockscoutTransactionType.CoinTransfer)) {
        return generateEvmCoinTransferActivityFromBlockscoutTransaction(
            blockscoutTransaction,
            localTransaction,
            evmNetwork,
            account
        )
    } else if (
        blockscoutTransaction.tx_types.includes(BlockscoutTransactionType.TokenTransfer) ||
        blockscoutTransaction.tx_types.includes(BlockscoutTransactionType.TokenMinting)
    ) {
        // if it is a blockscout transaction and a token transfer we have already generated this activity
        // there may be cases where thats not the case but we are unsure so we plan to add a fallback here at a lower priority
        return undefined
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
): Promise<EvmContractCallActivity> {
    const baseActivity = await generateBaseEvmActivityFromBlockscoutTransaction(
        blockscoutTransaction,
        localTransaction,
        evmNetwork,
        account
    )

    let method: string | undefined
    let parameters: Record<string, string> | undefined
    if (blockscoutTransaction.decoded_input) {
        // if decoded input is available we know the method and parameters and contract is verified
        const { method_id, method_call, parameters: _parameters } = blockscoutTransaction.decoded_input
        method = blockscoutTransaction.method
        parameters = _parameters

        if (!getMethodFromRegistry(HEX_PREFIX + method_id)) {
            const fourBytePrefix = HEX_PREFIX + method_id
            addMethodToRegistry(fourBytePrefix, method_call)
        }
    } else {
        const [_method, _parameters] = getMethodForEvmTransaction(blockscoutTransaction.raw_input) ?? []
        method = _method
        parameters = _parameters
    }

    return {
        ...baseActivity,
        type: EvmActivityType.ContractCall,
        verified: blockscoutTransaction.to.is_verified,
        methodId: blockscoutTransaction.decoded_input?.method_id ?? blockscoutTransaction.method, // `method` is the methodId if the inputs cannot be decoded
        method,
        parameters: parameters,
        rawData: blockscoutTransaction.raw_input,
        contractAddress: blockscoutTransaction.to?.hash.toLowerCase(),
    } as EvmContractCallActivity
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
    const baseActivity = await generateBaseEvmActivity(
        {
            recipient: blockscoutTransaction.to.hash.toLowerCase(),
            from: blockscoutTransaction.from.hash.toLowerCase(),
            gasUsed: Number(blockscoutTransaction.gas_used),
            estimatedGas: localTransaction?.estimatedGas,
            gasPrice: blockscoutTransaction.gas_price,
            transactionHash: blockscoutTransaction.hash,
            timestamp: new Date(blockscoutTransaction.timestamp).getTime(),
            blockNumber: blockscoutTransaction.block,
        },
        evmNetwork,
        account
    )

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

import { IAccountState } from '@core/account'
import { EvmActivityType } from '@core/activity/enums/evm'
import {
    EvmActivity,
    EvmCoinTransferActivity,
    EvmContractCallActivity,
    EvmTokenTransferActivity,
} from '@core/activity/types'
import { parseSmartContractDataFromTransactionData } from '@core/layer-2/utils/parseSmartContractDataFromTransactionData'
import { IEvmNetwork } from '@core/network'
import { NftStandard } from '@core/nfts'
import { BASE_TOKEN_ID, TokenStandard } from '@core/token'
import { LocalEvmTransaction } from '@core/transactions'
import { SubjectType } from '@core/wallet'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'
import { Converter } from '@core/utils'
import { ParsedSmartContractType } from '@core/layer-2'

export async function generateEvmActivityFromLocalEvmTransaction(
    transaction: LocalEvmTransaction,
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<EvmActivity | undefined> {
    if (!transaction.data) {
        const { to, from, gasUsed, estimatedGas, gasPrice, transactionHash, timestamp, blockNumber } = transaction
        // i.e must be a coin transfer
        const baseActivity = await generateBaseEvmActivity(
            {
                recipient: to?.toString().toLowerCase(),
                from: from?.toString().toLowerCase(),
                gasUsed: Number(gasUsed),
                estimatedGas,
                gasPrice: gasPrice ?? undefined,
                transactionHash,
                timestamp,
                blockNumber,
            },
            evmNetwork,
            account
        )

        return {
            ...baseActivity,
            type: EvmActivityType.CoinTransfer,
            baseTokenTransfer: {
                tokenId: BASE_TOKEN_ID,
                rawAmount: Converter.bigIntLikeToBigInt(transaction.value ?? 0),
            },
        } as EvmCoinTransferActivity
    }

    const parsedData = parseSmartContractDataFromTransactionData(
        { to: transaction.to?.toString(), data: transaction.data, value: transaction.value },
        evmNetwork
    )
    if (!parsedData) {
        return
    }

    const { to, from, gasUsed, estimatedGas, gasPrice, transactionHash, timestamp, blockNumber } = transaction
    let baseActivity = await generateBaseEvmActivity(
        {
            recipient: parsedData.recipientAddress ?? to?.toString().toLowerCase(),
            from: from?.toString().toLowerCase(),
            gasUsed: Number(gasUsed),
            estimatedGas,
            gasPrice: gasPrice ?? undefined,
            transactionHash,
            timestamp,
            blockNumber,
        },
        evmNetwork,
        account
    )

    baseActivity = {
        ...baseActivity,
        method: parsedData.parsedMethod?.name,
        parameters: parsedData.parsedMethod?.inputs,
        methodId: parsedData.rawMethod,
        rawData: String(transaction.data ?? ''),
        contract: {
            type: SubjectType.SmartContract,
            address: to?.toString().toLowerCase(),
            name: '',
            verified: false,
        },
    } as EvmContractCallActivity

    switch (parsedData.type) {
        case ParsedSmartContractType.SmartContract:
            return {
                ...baseActivity,
                type: EvmActivityType.ContractCall,
            } as EvmContractCallActivity
        case ParsedSmartContractType.CoinTransfer:
            return {
                ...baseActivity,
                type: EvmActivityType.CoinTransfer,
                baseTokenTransfer: {
                    tokenId: BASE_TOKEN_ID,
                    rawAmount: parsedData.rawAmount,
                },
            } as EvmCoinTransferActivity
        case ParsedSmartContractType.TokenTransfer:
            return {
                ...baseActivity,
                type: EvmActivityType.TokenTransfer,
                tokenTransfer: {
                    standard: TokenStandard.Erc20,
                    tokenId: parsedData.tokenId,
                    rawAmount: parsedData.rawAmount,
                },
            } as EvmTokenTransferActivity
        case ParsedSmartContractType.NftTransfer:
            return {
                ...baseActivity,
                type: EvmActivityType.TokenTransfer,
                tokenTransfer: {
                    standard: NftStandard.Erc721,
                    tokenId: parsedData.nftId,
                    rawAmount: BigInt(1),
                },
            } as EvmTokenTransferActivity
        default:
            break
    }
}

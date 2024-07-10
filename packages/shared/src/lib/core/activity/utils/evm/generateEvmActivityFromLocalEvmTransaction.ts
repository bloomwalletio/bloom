import { IAccountState } from '@core/account'
import { EvmActivityType } from '@core/activity/enums/evm'
import {
    EvmActivity,
    EvmCoinTransferActivity,
    EvmContractCallActivity,
    EvmTokenApprovalActivity,
    EvmTokenTransferActivity,
} from '@core/activity/types'
import { parseSmartContractDataFromTransactionData } from '@core/layer-2/utils/parseSmartContractDataFromTransactionData'
import { IEvmNetwork } from '@core/network'
import { BASE_TOKEN_ID } from '@core/token'
import { LocalEvmTransaction } from '@core/transactions'
import { SubjectType } from '@core/wallet'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'
import { Converter } from '@core/utils'
import { ParsedSmartContractType } from '@core/layer-2'
import { ActivityDirection } from '@core/activity/enums'

export async function generateEvmActivityFromLocalEvmTransaction(
    transaction: LocalEvmTransaction,
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<EvmActivity | undefined> {
    let baseActivity = await generateBaseEvmActivity(transaction, evmNetwork, account)

    if (!transaction.data) {
        // i.e must be a coin transfer
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

    transaction.recipient = parsedData.recipientAddress ?? transaction.to?.toString().toLowerCase()

    baseActivity = {
        ...baseActivity,
        method: parsedData.parsedMethod?.name,
        inputs: parsedData.parsedMethod?.inputs,
        methodId: parsedData.rawMethod,
        rawData: String(transaction.data ?? ''),
        contract: {
            type: SubjectType.SmartContract,
            address: transaction.to?.toString().toLowerCase(),
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
                    standard: parsedData.standard,
                    tokenId: parsedData.tokenId,
                    rawAmount: parsedData.rawAmount,
                },
            } as EvmTokenTransferActivity
        case ParsedSmartContractType.NftTransfer:
            return {
                ...baseActivity,
                type: EvmActivityType.TokenTransfer,
                tokenTransfer: {
                    standard: parsedData.standard,
                    tokenId: parsedData.nftId,
                    rawAmount: BigInt(1),
                },
            } as EvmTokenTransferActivity
        case ParsedSmartContractType.TokenApproval:
            return {
                ...baseActivity,
                type: EvmActivityType.TokenApproval,
                tokenTransfer: {
                    standard: parsedData.standard,
                    tokenId: parsedData.tokenId,
                    rawAmount: parsedData.rawAmount,
                },
                direction: ActivityDirection.SelfTransaction,
            } as EvmTokenApprovalActivity
        default:
            break
    }
}

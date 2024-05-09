import { IAccountState } from '@core/account'
import { StardustActivityType } from '@core/activity/enums'
import { EvmActivityType } from '@core/activity/enums/evm'
import {
    EvmActivity,
    EvmCoinTransferActivity,
    EvmContractCallActivity,
    EvmTokenTransferActivity,
} from '@core/activity/types'
import { getMethodForEvmTransaction } from '@core/layer-2/utils'
import { parseSmartContractDataFromTransactionData } from '@core/layer-2/utils/parseSmartContractDataFromTransactionData'
import { IEvmNetwork } from '@core/network'
import { NftStandard } from '@core/nfts'
import { BASE_TOKEN_ID, TokenStandard } from '@core/token'
import { LocalEvmTransaction } from '@core/transactions'
import { SubjectType } from '@core/wallet'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'
import { Converter } from '@core/utils'

export async function generateEvmActivityFromLocalEvmTransaction(
    transaction: LocalEvmTransaction,
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<EvmActivity | undefined> {
    if (transaction.data) {
        const transferInfo = parseSmartContractDataFromTransactionData(
            { to: transaction.to?.toString(), data: transaction.data, value: transaction.value },
            evmNetwork
        )
        if (!transferInfo) {
            return
        }

        const { to, from, gasUsed, estimatedGas, gasPrice, transactionHash, timestamp, blockNumber } = transaction
        const baseActivity = await generateBaseEvmActivity(
            {
                recipient: transferInfo.recipientAddress ?? to?.toString().toLowerCase(),
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
        if (transferInfo.type === StardustActivityType.SmartContract) {
            const data = String(transaction.data ?? '')
            const [method, parameters] = getMethodForEvmTransaction(data) ?? []
            return {
                ...baseActivity,
                type: EvmActivityType.ContractCall,
                method,
                parameters,
                methodId: data.substring(0, 10),
                rawData: data,
                contract: {
                    type: SubjectType.SmartContract,
                    address: to?.toString().toLowerCase(),
                    name: '',
                    verified: false,
                },
            } as EvmContractCallActivity
        } else {
            const tokenTransfer =
                transferInfo?.type === StardustActivityType.Basic
                    ? {
                          standard: TokenStandard.Erc20,
                          tokenId: transferInfo.tokenId,
                          rawAmount: transferInfo.rawAmount,
                      }
                    : {
                          standard: NftStandard.Erc721,
                          tokenId: transferInfo.nftId,
                          rawAmount: BigInt(1),
                      }

            return {
                ...baseActivity,
                type: EvmActivityType.TokenTransfer,
                contract: {
                    type: SubjectType.SmartContract,
                    address: to?.toString().toLowerCase(),
                    name: '',
                    verified: false,
                },
                tokenTransfer,
            } as EvmTokenTransferActivity
        }
    } else {
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
}

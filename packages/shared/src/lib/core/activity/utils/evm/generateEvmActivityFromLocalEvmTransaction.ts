import { IAccountState } from '@core/account'
import { StardustActivityType } from '@core/activity/enums'
import { EvmActivityType } from '@core/activity/enums/evm'
import {
    EvmActivity,
    EvmCoinTransferActivity,
    EvmContractCallActivity,
    EvmTokenTransferActivity,
} from '@core/activity/types'
import { WEI_PER_GLOW } from '@core/layer-2/constants'
import { getMethodForEvmTransaction } from '@core/layer-2/utils'
import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
import { IChain } from '@core/network'
import { NftStandard } from '@core/nfts'
import { BASE_TOKEN_ID, TokenStandard } from '@core/token'
import { LocalEvmTransaction } from '@core/transactions'
import { Converter } from '@core/utils/convert'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'

export async function generateEvmActivityFromLocalEvmTransaction(
    transaction: LocalEvmTransaction,
    chain: IChain,
    account: IAccountState
): Promise<EvmActivity | undefined> {
    if (transaction.data) {
        const transferInfo = getTransferInfoFromTransactionData(transaction, chain)
        if (!transferInfo) {
            return
        }

        const baseActivity = await generateBaseEvmActivity(
            {
                to: transaction.to?.toString().toLowerCase(),
                from: transaction.from?.toString().toLowerCase(),
                gasUsed: Number(transaction.gasUsed),
                estimatedGas: transaction?.estimatedGas,
                gasPrice: transaction.gasPrice ?? undefined,
                transactionHash: transaction.transactionHash,
                timestamp: transaction.timestamp,
                blockNumber: transaction.blockNumber,
            },
            chain,
            transferInfo.recipientAddress,
            account
        )
        if (transferInfo.type === StardustActivityType.SmartContract) {
            const data = String(transaction.data ?? '')
            const [method, parameters] = (await getMethodForEvmTransaction(data)) ?? []
            return {
                ...baseActivity,
                type: EvmActivityType.ContractCall,
                method,
                parameters,
                methodId: data.substring(0, 10),
                rawData: data,
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
                tokenTransfer,
            } as EvmTokenTransferActivity
        }
    } else {
        // i.e must be a coin transfer
        const baseActivity = await generateBaseEvmActivity(
            {
                to: transaction.to?.toString().toLowerCase(),
                from: transaction.from?.toString().toLowerCase(),
                gasUsed: Number(transaction.gasUsed),
                estimatedGas: transaction?.estimatedGas,
                gasPrice: transaction.gasPrice ?? undefined,
                transactionHash: transaction.transactionHash,
                timestamp: transaction.timestamp,
                blockNumber: transaction.blockNumber,
            },
            chain,
            transaction.to,
            account
        )

        return {
            ...baseActivity,
            type: EvmActivityType.CoinTransfer,
            baseTokenTransfer: {
                tokenId: BASE_TOKEN_ID,
                rawAmount: Converter.bigIntLikeToBigInt(transaction.value) / WEI_PER_GLOW,
            },
        } as EvmCoinTransferActivity
    }
}

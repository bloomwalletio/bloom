import { IAccountState } from '@core/account'
import { EvmActivityType } from '@core/activity/enums/evm'
import { EvmActivity, EvmCoinTransferActivity, EvmTokenTransferActivity } from '@core/activity/types'
import { IChain } from '@core/network'
import { LocalEvmTransaction } from '@core/transactions'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'
import { BASE_TOKEN_ID, TokenStandard } from '@core/token'
import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
import { StardustActivityType } from '@core/activity/enums'
import { NftStandard } from '@core/nfts'
import { Converter } from '@core/utils/convert'
import { getMethodNameForEvmTransaction } from '@core/layer-2/utils'
import { EvmContractCallActivity } from '@core/activity/types/evm/evm-contract-call-activity.type'
import { WEI_PER_GLOW } from '@core/layer-2/constants'

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
            const method = await getMethodNameForEvmTransaction(transaction)
            const data = String(transaction.data ?? '')
            return {
                ...baseActivity,
                type: EvmActivityType.ContractCall,
                method,
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

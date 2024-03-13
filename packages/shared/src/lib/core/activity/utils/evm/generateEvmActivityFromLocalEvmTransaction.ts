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

        if (transferInfo.type === StardustActivityType.SmartContract) {
            const baseEvmActivity = await generateBaseEvmActivity(
                transaction,
                chain,
                transaction.to?.toString(),
                account
            )
            const method = await getMethodNameForEvmTransaction(transaction)

            return {
                ...baseEvmActivity,
                type: EvmActivityType.ContractCall,
                method,
                rawData: String(transaction.data ?? ''),
            } as EvmContractCallActivity
        } else {
            const baseActivity = await generateBaseEvmActivity(
                transaction,
                chain,
                transferInfo.recipientAddress,
                account
            )
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
        const baseActivity = await generateBaseEvmActivity(transaction, chain, transaction.to, account)

        return {
            ...baseActivity,
            type: EvmActivityType.CoinTransfer,
            baseTokenTransfer: {
                tokenId: BASE_TOKEN_ID,
                rawAmount: Converter.bigIntLikeToBigInt(transaction.value),
            },
        } as EvmCoinTransferActivity
    }
}

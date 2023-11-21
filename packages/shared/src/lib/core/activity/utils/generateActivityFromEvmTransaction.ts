import { Activity, PersistedEvmTransaction } from '../types'
import { IChain } from '@core/network'
import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
import { AssetType } from '@core/layer-2'
import { generateTokenActivity } from './evm/generateTokenActivity'
import { generateNftActivity } from './evm/generateNftActivity'
import { IAccountState } from '@core/account/interfaces'

export async function generateActivityFromEvmTransaction(
    transaction: PersistedEvmTransaction,
    chain: IChain,
    account: IAccountState
): Promise<Activity | undefined> {
    const { asset, additionalBaseTokenAmount, recipientAddress } =
        getTransferInfoFromTransactionData(transaction, chain) ?? {}

    if (asset?.type === AssetType.Token || asset?.type === AssetType.BaseCoin) {
        return generateTokenActivity(
            transaction,
            chain,
            asset.tokenId,
            asset.rawAmount,
            additionalBaseTokenAmount,
            recipientAddress,
            account
        )
    } else if (asset?.type === AssetType.Nft) {
        return generateNftActivity(
            transaction,
            chain,
            asset.nftId,
            additionalBaseTokenAmount,
            recipientAddress,
            account
        )
    }
}

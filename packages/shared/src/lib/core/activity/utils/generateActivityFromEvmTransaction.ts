import { NetworkId } from '@core/network/types'
import { Activity, PersistedEvmTransaction } from '../types'
import { IChain } from '@core/network'
import { getTransferInfoFromTransactionData } from '@core/layer-2/utils/getTransferInfoFromTransactionData'
import { AssetType } from '@core/layer-2'
import { generateTokenActivity } from './evm/generateTokenActivity'
import { generateNftActivity } from './evm/generateNftActivity'
import { IAccountState } from '@core/account/interfaces'

export async function generateActivityFromEvmTransaction(
    transaction: PersistedEvmTransaction,
    networkId: NetworkId,
    chain: IChain,
    account: IAccountState
): Promise<Activity | undefined> {
    const { asset, recipientAddress } =
        getTransferInfoFromTransactionData(transaction, transaction.to, networkId, chain) ?? {}

    if (asset?.type === AssetType.Token || asset?.type === AssetType.BaseCoin) {
        return generateTokenActivity(
            transaction,
            networkId,
            chain,
            asset.tokenId,
            asset.rawAmount,
            recipientAddress,
            account
        )
    } else if (asset?.type === AssetType.Nft) {
        return generateNftActivity(transaction, networkId, chain, asset.nftId, recipientAddress, account)
    }
}

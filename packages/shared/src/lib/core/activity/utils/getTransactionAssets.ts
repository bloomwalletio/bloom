import { INft, getNftByIdFromAllAccountNfts } from '@core/nfts'
import { getCoinType } from '@core/profile/actions'
import { ActivityType } from '../enums'
import { getAssetById } from '@core/wallet/stores'
import { Activity } from '../types'
import { TokenTransferData } from '@core/wallet/types'
import { IAsset, getAssetFromPersistedAssets } from '@core/wallet'

export function getTransactionAssets(
    activity: Activity,
    accountIndex: number
):
    | {
          nft?: INft
          tokenTransfer?: TokenTransferData
          baseCoinTransfer?: TokenTransferData
      }
    | undefined {
    if (activity.type === ActivityType.Nft) {
        const baseCoin = getAssetById(getCoinType(), activity.networkId)
        const nft = getNftByIdFromAllAccountNfts(accountIndex, activity.nftId)
        return {
            nft,
            baseCoinTransfer: {
                rawAmount: String((activity.rawBaseCoinAmount ?? 0) - activity.storageDeposit),
                asset: baseCoin,
            },
        }
    } else if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
        const assetWithBalance = getAssetById(activity.assetId, activity.networkId)
        const persistedAsset = getAssetFromPersistedAssets(activity.assetId)
        const asset: IAsset = {
            chainId: activity.networkId,
            balance: {
                total: 0,
                available: 0,
            },
            ...assetWithBalance,
            ...persistedAsset,
        }
        if (activity.assetId === getCoinType()) {
            return {
                baseCoinTransfer: {
                    rawAmount: String(activity.rawBaseCoinAmount),
                    asset,
                },
            }
        } else {
            const baseCoin = getAssetById(getCoinType(), activity.networkId)
            return {
                tokenTransfer: {
                    rawAmount: String(activity.rawAmount),
                    asset,
                },
                baseCoinTransfer: {
                    rawAmount: String((activity.rawBaseCoinAmount ?? 0) - activity.storageDeposit),
                    asset: baseCoin,
                },
            }
        }
    }
}

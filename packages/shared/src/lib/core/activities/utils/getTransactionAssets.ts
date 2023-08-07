import { INft, getNftByIdFromAllAccountNfts } from '@core/nfts'
import { getCoinType } from '@core/profile/actions'
import { ActivityType } from '@core/wallet/enums'
import { getAssetById } from '@core/wallet/stores'
import { Activity, TokenTransferData } from '@core/wallet/types'

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
    } else if (activity.type === ActivityType.Basic) {
        const asset = getAssetById(activity.assetId, activity.networkId)
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

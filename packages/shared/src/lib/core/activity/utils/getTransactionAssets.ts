import { getActiveNetworkId } from '@core/network/utils/getNetworkId'
import { INft, getNftByIdFromAllAccountNfts } from '@core/nfts'
import { getCoinType } from '@core/profile/actions'
import { ActivityType } from '../enums'
import { getAssetById } from '@core/wallet/stores'
import { Activity } from '../types'
import { TokenTransferData } from '@core/wallet/types'

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
    const networkId = activity.chainId || getActiveNetworkId()?.toString()
    if (!networkId) {
        return
    }

    if (activity.type === ActivityType.Nft) {
        const baseCoin = getAssetById(getCoinType(), networkId)
        const nft = getNftByIdFromAllAccountNfts(accountIndex, activity.nftId)
        return {
            nft,
            baseCoinTransfer: {
                rawAmount: String((activity.rawBaseCoinAmount ?? 0) - activity.storageDeposit),
                asset: baseCoin,
            },
        }
    } else if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
        const asset = getAssetById(activity.assetId, networkId)
        if (activity.assetId === getCoinType()) {
            return {
                baseCoinTransfer: {
                    rawAmount: String(activity.rawBaseCoinAmount),
                    asset,
                },
            }
        } else {
            const baseCoin = getAssetById(getCoinType(), networkId)
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

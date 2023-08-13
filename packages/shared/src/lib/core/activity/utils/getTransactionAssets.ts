import { INft } from '@core/nfts'
import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
import { getCoinType } from '@core/profile/actions'
import { IToken } from '@core/token/interfaces'
import { getTokenFromSelectedAccountTokens, getPersistedToken } from '@core/token/stores'
import { TokenTransferData } from '@core/wallet/types'
import { ActivityType } from '../enums'
import { Activity } from '../types'

export function getTransactionAssets(
    activity: Activity,
    accountIndex: number
):
    | {
          nft?: INft
          aliasId?: string
          tokenTransfer?: TokenTransferData
          baseCoinTransfer?: TokenTransferData
      }
    | undefined {
    if (activity.type === ActivityType.Nft) {
        const baseCoin = getTokenFromSelectedAccountTokens(getCoinType(), activity.networkId)
        const nft = getNftByIdFromAllAccountNfts(accountIndex, activity.nftId)
        return {
            nft,
            baseCoinTransfer: {
                rawAmount: String((activity.rawBaseCoinAmount ?? 0) - activity.storageDeposit),
                token: baseCoin,
            },
        }
    } else if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
        const tokenWithBalance = getTokenFromSelectedAccountTokens(activity.tokenId, activity.networkId)
        const persistedToken = getPersistedToken(activity.tokenId)
        const token: IToken = {
            networkId: activity.networkId,
            balance: {
                total: 0,
                available: 0,
            },
            ...tokenWithBalance,
            ...persistedToken,
        }
        if (activity.tokenId === getCoinType()) {
            return {
                baseCoinTransfer: {
                    rawAmount: String(activity.rawBaseCoinAmount),
                    token,
                },
            }
        } else {
            const baseCoin = getTokenFromSelectedAccountTokens(getCoinType(), activity.networkId)
            return {
                tokenTransfer: {
                    rawAmount: String(activity.rawAmount),
                    token,
                },
                baseCoinTransfer: {
                    rawAmount: String((activity.rawBaseCoinAmount ?? 0) - activity.storageDeposit),
                    token: baseCoin,
                },
            }
        }
    }
}

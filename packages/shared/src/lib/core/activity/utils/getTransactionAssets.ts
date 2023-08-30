import { INft } from '@core/nfts'
import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
import { getCoinType } from '@core/profile/actions'
import { IToken } from '@core/token/interfaces'
import { getTokenFromSelectedAccountTokens, getPersistedToken } from '@core/token/stores'
import { ActivityType, GovernanceAction } from '../enums'
import { Activity } from '../types'
import { TokenTransferData } from '@core/wallet/types'

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
        const baseCoin = getTokenFromSelectedAccountTokens(getCoinType(), activity.sourceNetworkId)
        const nft = getNftByIdFromAllAccountNfts(accountIndex, activity.nftId)
        return {
            nft,
            baseCoinTransfer: {
                rawAmount: String((activity.rawBaseCoinAmount ?? 0) - activity.storageDeposit),
                token: baseCoin,
            },
        }
    } else if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
        const tokenWithBalance = getTokenFromSelectedAccountTokens(activity.tokenId, activity.sourceNetworkId)
        const persistedToken = getPersistedToken(activity.tokenId)
        const token: IToken = {
            networkId: activity.sourceNetworkId,
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
            const baseCoin = getTokenFromSelectedAccountTokens(getCoinType(), activity.sourceNetworkId)
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
    } else if (activity.type === ActivityType.Governance) {
        const baseCoin = getTokenFromSelectedAccountTokens(getCoinType(), activity.sourceNetworkId)

        const isVotingPowerActivity =
            activity.governanceAction === GovernanceAction.DecreaseVotingPower ||
            activity.governanceAction === GovernanceAction.IncreaseVotingPower
        const amount = isVotingPowerActivity ? activity.votingPowerDifference : activity.votingPower
        return {
            baseCoinTransfer: {
                rawAmount: String(amount),
                token: baseCoin,
            },
        }
    }
}

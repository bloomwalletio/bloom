import { INft } from '@core/nfts'
import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
import { BASE_TOKEN_ID } from '@core/token'
import { IToken } from '@core/token/interfaces'
import { getPersistedToken, getTokenFromSelectedAccountTokens } from '@core/token/stores'
import { TokenTransferData } from '@core/wallet/types'
import { ActivityType, GovernanceAction } from '../enums'
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
        const baseCoin = getTokenFromSelectedAccountTokens(BASE_TOKEN_ID, activity.sourceNetworkId)
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
        if (activity.tokenId === BASE_TOKEN_ID) {
            return {
                baseCoinTransfer: {
                    rawAmount: String(activity.rawAmount),
                    token,
                },
            }
        } else {
            const baseCoin = getTokenFromSelectedAccountTokens(BASE_TOKEN_ID, activity.sourceNetworkId)
            return {
                tokenTransfer: {
                    rawAmount: String(activity.rawAmount),
                    token,
                },
                baseCoinTransfer: {
                    rawAmount: String(
                        (activity.rawBaseCoinAmount ?? 0) - activity.storageDeposit - (activity?.transactionFee ?? 0)
                    ),
                    token: baseCoin,
                },
            }
        }
    } else if (activity.type === ActivityType.Governance) {
        const baseCoin = getTokenFromSelectedAccountTokens(BASE_TOKEN_ID, activity.sourceNetworkId)

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
    } else if (activity.type === ActivityType.Alias) {
        return {
            aliasId: activity.aliasId,
        }
    }
}

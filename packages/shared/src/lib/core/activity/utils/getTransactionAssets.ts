import { Nft } from '@core/nfts'
import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
import { TokenTransferData } from '@core/wallet/types'
import { ActivityAction, ActivityType, GovernanceAction } from '../enums'
import { Activity } from '../types'
import { getPersistedToken } from '@core/token/stores'
import { BASE_TOKEN_ID, IToken } from '@core/token'

export function getTransactionAssets(
    activity: Activity,
    accountIndex: number
):
    | {
          nft?: Nft
          aliasId?: string
          tokenTransfer?: TokenTransferData
          baseCoinTransfer?: TokenTransferData
      }
    | undefined {
    const baseCoin = { ...getPersistedToken(BASE_TOKEN_ID), networkId: activity.sourceNetworkId }

    if (!baseCoin) {
        return undefined
    }

    const baseCoinTransfer =
        activity.action === ActivityAction.Burn
            ? undefined
            : {
                  rawAmount: activity.baseTokenTransfer.rawAmount,
                  token: baseCoin,
              }

    if (activity.type === ActivityType.Nft) {
        const nft = getNftByIdFromAllAccountNfts(accountIndex, activity.nftId)
        return {
            nft,
            baseCoinTransfer,
        }
    } else if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
        const token: IToken | undefined = activity.tokenTransfer?.tokenId
            ? { ...getPersistedToken(activity.tokenTransfer.tokenId), networkId: activity.sourceNetworkId }
            : undefined
        const tokenAmount = activity.tokenTransfer?.rawAmount

        return {
            tokenTransfer:
                token && tokenAmount
                    ? {
                          rawAmount: tokenAmount,
                          token,
                      }
                    : undefined,
            baseCoinTransfer,
        }
    } else if (activity.type === ActivityType.Governance) {
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
            baseCoinTransfer,
        }
    }
}

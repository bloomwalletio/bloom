import { Nft } from '@core/nfts'
import { getNftByIdForAccount } from '@core/nfts/stores'
import { TokenTransferData } from '@core/wallet/types'
import { ActivityAction, StardustActivityType, StardustGovernanceAction } from '../enums'
import { StardustActivity } from '../types'
import { getPersistedToken } from '@core/token/stores'
import { BASE_TOKEN_ID, IToken } from '@core/token'

export function getTransactionAssets(
    activity: StardustActivity,
    accountIndex: number
):
    | {
          nft?: Nft
          aliasId?: string
          tokenTransfer?: TokenTransferData
          baseCoinTransfer?: TokenTransferData
      }
    | undefined {
    const baseCoin = {
        ...getPersistedToken(activity.sourceNetworkId, BASE_TOKEN_ID),
        networkId: activity.sourceNetworkId,
    }

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

    if (activity.type === StardustActivityType.Nft) {
        const nft = getNftByIdForAccount(accountIndex, activity.nftId)
        return {
            nft,
            baseCoinTransfer,
        }
    } else if (activity.type === StardustActivityType.Basic || activity.type === StardustActivityType.Foundry) {
        const token: IToken | undefined = activity.tokenTransfer?.tokenId
            ? {
                  ...getPersistedToken(activity.sourceNetworkId, activity.tokenTransfer.tokenId),
                  networkId: activity.sourceNetworkId,
              }
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
    } else if (activity.type === StardustActivityType.Governance) {
        const isVotingPowerActivity =
            activity.governanceAction === StardustGovernanceAction.DecreaseVotingPower ||
            activity.governanceAction === StardustGovernanceAction.IncreaseVotingPower
        const amount = isVotingPowerActivity ? activity.votingPowerDifference : activity.votingPower
        return {
            baseCoinTransfer: {
                rawAmount: amount ?? BigInt(0),
                token: baseCoin,
            },
        }
    } else if (activity.type === StardustActivityType.Alias) {
        return {
            aliasId: activity.aliasId,
            baseCoinTransfer,
        }
    }
}

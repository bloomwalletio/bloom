import { INft } from '@core/nfts'
import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
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
        const nft = getNftByIdFromAllAccountNfts(accountIndex, activity.nftId)
        return {
            nft,
            baseCoinTransfer: activity.baseTokenTransfer,
        }
    } else if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
        return {
            tokenTransfer: activity.tokenTransfer,
            baseCoinTransfer: activity.baseTokenTransfer,
        }
    } else if (activity.type === ActivityType.Governance) {
        const isVotingPowerActivity =
            activity.governanceAction === GovernanceAction.DecreaseVotingPower ||
            activity.governanceAction === GovernanceAction.IncreaseVotingPower
        const amount = isVotingPowerActivity ? activity.votingPowerDifference : activity.votingPower
        return {
            baseCoinTransfer: {
                rawAmount: String(amount),
                token: activity.baseTokenTransfer.token,
            },
        }
    } else if (activity.type === ActivityType.Alias) {
        return {
            aliasId: activity.aliasId,
        }
    }
}

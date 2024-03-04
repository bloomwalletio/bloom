import { StardustActivityType, StardustGovernanceAction } from '../enums'
import { StardustActivity } from '../types'
import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
import { getTokenFromActivity } from './getTokenFromActivity'
import { get } from 'svelte/store'
import { registeredProposalsForSelectedAccount } from '@contexts/governance'

export function getActivityTileAsset(activity: StardustActivity, accountIndex: number): string {
    if (activity.type === StardustActivityType.Basic || activity.type === StardustActivityType.Foundry) {
        const token = getTokenFromActivity(activity)
        if (!token) {
            return ''
        }

        return token.metadata?.name ? token.metadata.name : token.id
    } else if (activity.type === StardustActivityType.Nft) {
        const nft = getNftByIdFromAllAccountNfts(accountIndex, activity.nftId)
        return nft?.name ? nft.name : 'NFT'
    } else if (activity.type === StardustActivityType.SmartContract) {
        return activity.recipient?.address ?? ''
    } else if (activity.type === StardustActivityType.Alias) {
        return 'Alias ' + activity.aliasId
    } else if (activity.type === StardustActivityType.Consolidation) {
        return ''
    } else if (activity.type === StardustActivityType.Governance) {
        if (
            [StardustGovernanceAction.StartVoting, StardustGovernanceAction.StopVoting].includes(
                activity.governanceAction
            )
        ) {
            if (activity?.participation?.eventId) {
                const proposal = get(registeredProposalsForSelectedAccount)?.[activity.participation.eventId]
                return proposal?.title ?? ''
            } else {
                return activity.participation?.eventId ?? ''
            }
        }
        return ''
    } else {
        return ''
    }
}

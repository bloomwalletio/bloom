import { ActivityType, GovernanceAction } from '../enums'
import { StardustActivity } from '../types'
import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
import { getTokenFromActivity } from './getTokenFromActivity'
import { get } from 'svelte/store'
import { registeredProposalsForSelectedAccount } from '@contexts/governance'

export function getActivityTileAsset(activity: StardustActivity, accountIndex: number): string {
    if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
        const token = getTokenFromActivity(activity)
        if (!token) {
            return ''
        }

        return token.metadata?.name ? token.metadata.name : token.id
    } else if (activity.type === ActivityType.Nft) {
        const nft = getNftByIdFromAllAccountNfts(accountIndex, activity.nftId)
        return nft?.name ? nft.name : 'NFT'
    } else if (activity.type === ActivityType.SmartContract) {
        return activity.recipient?.address ?? ''
    } else if (activity.type === ActivityType.Alias) {
        return 'Alias ' + activity.aliasId
    } else if (activity.type === ActivityType.Consolidation) {
        return ''
    } else if (activity.type === ActivityType.Governance) {
        if ([GovernanceAction.StartVoting, GovernanceAction.StopVoting].includes(activity.governanceAction)) {
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

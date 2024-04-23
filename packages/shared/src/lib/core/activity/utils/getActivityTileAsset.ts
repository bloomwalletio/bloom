import { StardustActivityType, StardustGovernanceAction } from '../enums'
import { Activity } from '../types'
import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
import { getTokenFromActivity } from './getTokenFromActivity'
import { get } from 'svelte/store'
import { registeredProposalsForSelectedAccount } from '@contexts/governance'
import { NetworkNamespace } from '@core/network'
import { EvmActivityType } from '../enums/evm'
import { NftStandard } from '@core/nfts'
import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
import { BASE_TOKEN_ID } from '@core/token/constants'
import { localize } from '@core/i18n'
import { isEvmTokenActivity } from './isEvmTokenActivity'

export function getActivityTileAsset(activity: Activity, accountIndex: number): string {
    if (activity.namespace === NetworkNamespace.Stardust) {
        if (activity.type === StardustActivityType.Basic || activity.type === StardustActivityType.Foundry) {
            const token = getTokenFromActivity(activity)
            if (!token) {
                return ''
            }

            return token.metadata?.name ? token.metadata.name : token.id
        } else if (activity.type === StardustActivityType.Nft) {
            const nft = getNftByIdFromAllAccountNfts(accountIndex, activity.nftId)
            return nft?.name ? nft.name : 'NFT'
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
    } else if (activity.namespace === NetworkNamespace.Evm) {
        if (activity.type === EvmActivityType.CoinTransfer) {
            const token = getTokenFromSelectedAccountTokens(BASE_TOKEN_ID, activity.sourceNetworkId)
            return token?.metadata?.name ? token.metadata.name : token?.id ?? ''
        } else if (isEvmTokenActivity(activity)) {
            if (
                activity.tokenTransfer.standard === NftStandard.Erc721 ||
                activity.tokenTransfer.standard === NftStandard.Irc27
            ) {
                const nft = getNftByIdFromAllAccountNfts(accountIndex, activity.tokenTransfer.tokenId)
                return nft?.name ? nft.name : localize('general.nft')
            } else {
                const token = getTokenFromSelectedAccountTokens(
                    activity.tokenTransfer.tokenId,
                    activity.sourceNetworkId
                )
                return token?.metadata?.name ? token.metadata.name : token?.id ?? localize('general.unknownToken')
            }
        } else if (activity.type === EvmActivityType.ContractCall) {
            return activity.recipient?.address ?? localize('general.smartContract')
        } else {
            return ''
        }
    } else {
        return ''
    }
}

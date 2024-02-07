import { ActivityType } from '../enums'
import { Activity } from '../types'
import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
import { localize } from '@core/i18n'
import { getTokenFromActivity } from './getTokenFromActivity'

export function getActivityTileAsset(activity: Activity, accountIndex: number): string | undefined {
    if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
        const token = getTokenFromActivity(activity)
        if (!token) return ''

        return token.metadata?.name ? token.metadata.name : token.id
    } else if (activity.type === ActivityType.Nft) {
        const nft = getNftByIdFromAllAccountNfts(accountIndex, activity.nftId)
        return nft?.name ? nft.name : 'NFT'
    } else if (activity.type === ActivityType.SmartContract) {
        return localize('general.smartContract')
    } else if (activity.type === ActivityType.Alias) {
        return 'Alias ' + activity.aliasId
    } else if (activity.type === ActivityType.Consolidation) {
        return ''
    } else if (activity.type === ActivityType.Governance) {
        return ''
    } else {
        return ''
    }
}

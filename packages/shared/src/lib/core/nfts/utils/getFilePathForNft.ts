import { getActiveProfile } from '@core/profile/stores'
import { Nft } from '../interfaces'

export function buildFilePath(nft: Nft): string {
    const profileId = getActiveProfile()?.id

    return `${profileId}/nfts/${nft.id}`
}

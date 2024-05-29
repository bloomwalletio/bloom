import { NftStandard } from '@core/nfts'
import { persistedNfts } from '@core/nfts/stores'
import { IPersistedProfile } from '@core/profile/interfaces'

export function prodProfileMigration7To8(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    persistedNfts.update((state) => {
        const profilePersistedNfts = state[profile.id] ?? {}
        for (const nftId of Object.keys(profilePersistedNfts)) {
            const nft = profilePersistedNfts[nftId]
            if (!nft.mediaUrl && nft.standard === NftStandard.Erc721) {
                nft.mediaUrl = nft?.metadata?.image
                profilePersistedNfts[nftId] = nft
            }
        }
        state[profile.id] = profilePersistedNfts
        return state
    })

    return Promise.resolve()
}

import { persistedBalanceChanges } from '@core/activity'
import { NetworkId } from '@core/network'
import { persistedNfts } from '@core/nfts/stores'
import { profiles } from '@core/profile/stores'

export function alphaProfileMigration5To6(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as { id: string }

    persistedNfts.update((state) => {
        const nfts = state[profile.id]
        if (!nfts) {
            return state
        }

        for (const nftId of Object.keys(nfts)) {
            const nft = nfts[nftId]

            const isLowerCase = nftId === nftId.toLowerCase()

            if (isLowerCase) {
                state[profile.id][nftId] = { ...nft, id: nftId.toLowerCase() }
            } else {
                state[profile.id][nftId.toLowerCase()] = { ...nft, id: nftId.toLowerCase() }
                delete state[profile.id][nftId]
            }
        }
        return state
    })

    persistedBalanceChanges.update((state) => {
        const profileBalanceChanges = state[profile.id]
        if (!profileBalanceChanges) {
            return state
        }

        for (const accountId of Object.keys(profileBalanceChanges)) {
            const accountBalanceChanges = profileBalanceChanges[accountId]

            for (const networkId of Object.keys(accountBalanceChanges)) {
                const networkBalanceChanges = accountBalanceChanges[networkId as NetworkId]
                if (!networkBalanceChanges) {
                    continue
                }
                for (const nftId of Object.keys(networkBalanceChanges.nfts)) {
                    const balanceChanges = networkBalanceChanges.nfts[nftId]

                    const isLowerCase = nftId === nftId.toLowerCase()

                    if (!isLowerCase) {
                        networkBalanceChanges.nfts[nftId.toLowerCase()] = balanceChanges
                        delete networkBalanceChanges.nfts[nftId]
                    }
                }
                accountBalanceChanges[networkId as NetworkId] = networkBalanceChanges
            }
            profileBalanceChanges[accountId] = accountBalanceChanges
        }

        state[profile.id] = profileBalanceChanges
        return state
    })

    profiles.update((state) => {
        const profileIndex = state.findIndex((p) => p.id === profile.id)
        const _profile = state[profileIndex]
        if (!_profile) {
            return state
        }

        for (const networkId of Object.keys(_profile.trackedNfts)) {
            const trackedNfts = _profile.trackedNfts[networkId as NetworkId] ?? {}

            for (const nftId of Object.keys(trackedNfts)) {
                const isLowerCase = nftId === nftId.toLowerCase()
                if (!isLowerCase) {
                    trackedNfts[nftId.toLowerCase()] = trackedNfts[nftId]
                    delete trackedNfts[nftId]
                }
            }
            _profile.trackedNfts[networkId as NetworkId] = trackedNfts
        }
        state[profileIndex] = _profile
        return state
    })

    return Promise.resolve()
}

import { persistedBalanceChanges } from '@core/activity'
import { NetworkId } from '@core/network'
import { persistedNfts } from '@core/nfts/stores'

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

    return Promise.resolve()
}

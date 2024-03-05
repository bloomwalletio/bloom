import { persistedBalanceChanges } from '@core/activity'
import { isIrcAsset } from '@core/layer-2'
import { NetworkId } from '@core/network'

export function removeEvmBalanceChanges(profileId: string): void {
    persistedBalanceChanges.update((state) => {
        const profileBalanceChanges = state[profileId]
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
                const tokens = networkBalanceChanges.tokens
                const nfts = networkBalanceChanges.nfts

                for (const nftId of Object.keys(nfts ?? {})) {
                    if (!isIrcAsset(nftId)) {
                        delete nfts[nftId]
                    }
                }

                for (const tokenId of Object.keys(tokens ?? {})) {
                    if (!isIrcAsset(tokenId)) {
                        delete tokens[tokenId]
                    }
                }

                accountBalanceChanges[networkId as NetworkId] = networkBalanceChanges
            }
            profileBalanceChanges[accountId] = accountBalanceChanges
        }

        state[profileId] = profileBalanceChanges
        return state
    })
}

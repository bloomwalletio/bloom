import { ITokenBalanceChange, persistedBalanceChanges } from '@core/activity'
import { NetworkId } from '@core/network'

export async function alphaProfileMigration1To2(existingProfile: unknown): Promise<void> {
    const profileId = (existingProfile as { id?: string })?.id
    if (profileId) {
        persistedBalanceChanges.update((state) => {
            const balanceChangesFoProfile = state[profileId]

            for (const accountId of Object.keys(balanceChangesFoProfile)) {
                const balanceChangesFoProfileForAccount = state[profileId][accountId]

                for (const networkId of Object.keys(balanceChangesFoProfileForAccount)) {
                    const balanceChangesFoProfileForNetwork = balanceChangesFoProfileForAccount[
                        networkId as NetworkId
                    ] as unknown as {
                        [tokenId: string]: ITokenBalanceChange[]
                    }

                    state[profileId][accountId][networkId as NetworkId] = {
                        tokens: balanceChangesFoProfileForNetwork,
                        nfts: {},
                    }
                }
            }
            return state
        })
        return Promise.resolve()
    }
}

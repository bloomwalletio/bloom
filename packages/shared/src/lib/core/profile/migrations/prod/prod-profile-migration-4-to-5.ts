import { NetworkId } from '@core/network'
import { IPersistedProfile } from '@core/profile/interfaces'
import { LocalEvmTransaction } from '@core/transactions'
import { addLocalTransactionToPersistedTransaction } from '@core/transactions/stores'

export function prodProfileMigration4To5(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    profile.features = {
        wallet: true,
        collectibles: true,
        campaigns: true,
        governance: true,
        buySell: true,
        // @ts-expect-error isDeveloperProfile was removed in favor of the feature flag, but it exists on old profiles
        developer: profile.isDeveloperProfile,
        settings: true,
    }

    try {
        const json = localStorage.getItem('evmTransactions')
        if (!json) {
            return Promise.resolve()
        }

        const transactions =
            JSON.parse(json) ??
            ({} as {
                [profileId: string]: {
                    [accountId: string]: {
                        [networkId in NetworkId]?: LocalEvmTransaction[]
                    }
                }
            })
        const transactionsForProfile = transactions[profile.id] ?? {}
        for (const accountIndex of Object.keys(transactionsForProfile)) {
            const transactionsForAccount = transactionsForProfile[accountIndex] ?? {}

            for (const networkId of Object.keys(transactionsForAccount)) {
                const transactionsForNetwork = transactionsForAccount[networkId] ?? []

                addLocalTransactionToPersistedTransaction(
                    profile.id,
                    parseInt(accountIndex),
                    networkId as NetworkId,
                    transactionsForNetwork
                )
            }
        }
        delete transactions[profile.id]

        localStorage.setItem('evmTransactions', JSON.stringify(transactions))
    } catch (error) {
        return Promise.reject()
    }

    return Promise.resolve()
}

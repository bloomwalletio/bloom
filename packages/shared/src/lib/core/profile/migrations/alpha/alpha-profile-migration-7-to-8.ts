import { EvmNetworkId, NetworkId } from '@core/network'
import { LocalEvmTransaction } from '@core/transactions'
import { addLocalTransactionToPersistedTransaction } from '@core/transactions/stores'

export function alphaProfileMigration7To8(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as { id: string }

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
                    networkId as EvmNetworkId,
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

import { NetworkId } from '@core/network/types'
import { addLocalTransactionToPersistedTransaction } from '@core/transactions/stores'
import { LocalEvmTransaction } from '@core/transactions/types'

export async function checkAndMigrateOldLocalEvmTransactions(profile: { id: string }): Promise<void> {
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
}

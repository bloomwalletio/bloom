import { InclusionState } from '@core/activity'
import { updateEvmActivity } from '@core/activity/stores'
import { FAILED_CONFIRMATION, IEvmNetwork } from '@core/network'
import { LocalEvmTransaction } from '@core/transactions'
import { addLocalTransactionToPersistedTransaction } from '@core/transactions/stores'

export async function startEvmConfirmationPoll(
    transaction: LocalEvmTransaction,
    evmNetwork: IEvmNetwork,
    accountIndex: number,
    profileId: string
): Promise<void> {
    const { transactionHash, blockNumber } = transaction
    if (!blockNumber) {
        return
    }

    const subscription = await evmNetwork.provider.eth.subscribe('newBlockHeaders')

    subscription.on('data', async (result) => {
        const currentBlockNumber = result.number
        if (currentBlockNumber === null || currentBlockNumber === undefined) {
            return
        }

        let confirmations = Number(BigInt(currentBlockNumber) - BigInt(blockNumber))
        let inclusionState = InclusionState.Pending

        if (confirmations >= evmNetwork.blocksUntilConfirmed) {
            try {
                const receipt = await evmNetwork.provider.eth.getTransactionReceipt(transactionHash)
                if (receipt && receipt.blockNumber) {
                    inclusionState = InclusionState.Confirmed
                } else {
                    throw new Error('Transaction receipt not found')
                }
            } catch (error) {
                inclusionState = InclusionState.Conflicting
                confirmations = FAILED_CONFIRMATION
            } finally {
                addLocalTransactionToPersistedTransaction(profileId, accountIndex, evmNetwork.id, [
                    { ...transaction, confirmations },
                ])
                updateEvmActivity(accountIndex, transactionHash, { inclusionState })

                subscription.unsubscribe()
            }
        } else {
            updateEvmActivity(accountIndex, transactionHash, { inclusionState })
        }
    })

    subscription.on('error', (error: Error) => {
        console.error('Error in newBlockHeaders subscription:', error)
    })
}

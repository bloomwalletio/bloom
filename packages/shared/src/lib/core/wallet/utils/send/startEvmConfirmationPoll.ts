import { InclusionState } from '@core/activity'
import { updateEvmActivity } from '@core/activity/stores'
import { FAILED_CONFIRMATION, IEvmNetwork } from '@core/network'
import { LocalEvmTransaction } from '@core/transactions'
import { addLocalTransactionToPersistedTransaction } from '@core/transactions/stores'
import { MILLISECONDS_PER_SECOND } from '@core/utils'

export function startEvmConfirmationPoll(
    transaction: LocalEvmTransaction,
    evmNetwork: IEvmNetwork,
    accountIndex: number,
    profileId: string
): void {
    const { transactionHash, blockNumber } = transaction
    const pollInterval = evmNetwork.averageBlockTimeInSeconds * MILLISECONDS_PER_SECOND

    const poll = async () => {
        const currentBlockNumber = await evmNetwork.provider.eth.getBlockNumber()
        let confirmations = Number(BigInt(currentBlockNumber) - BigInt(blockNumber))

        let inclusionState = InclusionState.Pending
        if (confirmations >= evmNetwork.blocksUntilConfirmed) {
            try {
                await evmNetwork.provider.eth.getTransactionReceipt(transactionHash)
                inclusionState = InclusionState.Confirmed
            } catch (error) {
                inclusionState = InclusionState.Conflicting
                confirmations = FAILED_CONFIRMATION
            } finally {
                addLocalTransactionToPersistedTransaction(profileId, accountIndex, evmNetwork.id, [
                    { ...transaction, confirmations },
                ])
                updateEvmActivity(accountIndex, transactionHash, { inclusionState })
                clearInterval(interval)
            }
        } else {
            updateEvmActivity(accountIndex, transactionHash, { inclusionState })
        }
    }

    const interval = setInterval(() => void poll(), pollInterval)
}

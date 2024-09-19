import { InclusionState } from '@core/activity'
import { updateEvmActivity } from '@core/activity/stores'
import { FAILED_CONFIRMATION, IEvmNetwork } from '@core/network'
import { LocalEvmTransaction } from '@core/transactions'
import { addLocalTransactionToPersistedTransaction } from '@core/transactions/stores'
import { MILLISECONDS_PER_SECOND } from '@core/utils/constants'
import { Converter } from '@core/utils/convert'
import { BigIntLike } from '@ethereumjs/util'

export async function startEvmConfirmationPoll(
    transaction: LocalEvmTransaction,
    evmNetwork: IEvmNetwork,
    accountIndex: number,
    profileId: string
): Promise<void> {
    const { transactionHash, blockNumber: transactionBlockNumber } = transaction
    if (!transactionBlockNumber) {
        return
    }

    let isLogicInProgress = false

    async function _pollingLogic(currentBlockNumber: BigIntLike, onCancel: () => void): Promise<void> {
        if (isLogicInProgress) return

        isLogicInProgress = true
        if (currentBlockNumber === null || currentBlockNumber === undefined) {
            isLogicInProgress = false
            return
        }

        let confirmations = Number(
            Converter.bigIntLikeToBigInt(currentBlockNumber) - Converter.bigIntLikeToBigInt(transactionBlockNumber)
        )
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
                console.error(error)
            } finally {
                addLocalTransactionToPersistedTransaction(profileId, accountIndex, evmNetwork.id, [
                    { ...transaction, confirmations },
                ])
                updateEvmActivity(accountIndex, transactionHash, { inclusionState })

                onCancel()
            }
        } else {
            updateEvmActivity(accountIndex, transactionHash, { inclusionState })
        }
        isLogicInProgress = false
    }

    try {
        const subscription = await evmNetwork.provider.eth.subscribe('newBlockHeaders')
        subscription.on('data', (result) => {
            void _pollingLogic(result?.number ?? 0, subscription.unsubscribe)
        })

        subscription.on('error', (error: Error) => {
            console.error('Error in newBlockHeaders subscription:', error)
        })
    } catch (error) {
        if (error.name === 'SubscriptionError' && error.code === 603) {
            async function _intervalLogic(): Promise<void> {
                const currentBlockNumber = await evmNetwork.provider.eth.getBlockNumber()
                void _pollingLogic(currentBlockNumber, () => clearInterval(intervalId))
            }

            const pollInterval = evmNetwork.averageBlockTimeInSeconds * MILLISECONDS_PER_SECOND

            const intervalId = setInterval(() => void _intervalLogic(), pollInterval)
        }
    }
}

import { FAILED_CONFIRMATION, IEvmNetwork } from '@core/network'
import { activeAccounts } from '@core/profile/stores'
import { LocalEvmTransaction } from '@core/transactions'
import { MILLISECONDS_PER_SECOND } from '@core/utils/constants'
import { Converter } from '@core/utils/convert'
import { updatePersistedTransactionAndActivity } from '@core/wallet/actions'
import { BigIntLike } from '@ethereumjs/util'
import { get } from 'svelte/store'

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

        const accountState = get(activeAccounts)?.find((account) => account.index === accountIndex)

        if (confirmations >= evmNetwork.blocksUntilConfirmed) {
            try {
                const receipt = await evmNetwork.provider.eth.getTransactionReceipt(transactionHash)
                if (!receipt || !receipt.blockNumber) {
                    throw new Error('Transaction receipt not found')
                }
            } catch (error) {
                confirmations = FAILED_CONFIRMATION
                console.error(error)
            } finally {
                if (accountState) {
                    await updatePersistedTransactionAndActivity(profileId, accountState, evmNetwork, {
                        transactionHash,
                        confirmations,
                    })
                }

                onCancel()
            }
        } else {
            if (accountState) {
                await updatePersistedTransactionAndActivity(profileId, accountState, evmNetwork, {
                    transactionHash,
                    confirmations,
                })
            }
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
        const _error = (error ?? {}) as { name?: string; code?: number }

        if (_error?.name === 'SubscriptionError' && _error?.code === 603) {
            async function _intervalLogic(): Promise<void> {
                const currentBlockNumber = await evmNetwork.provider.eth.getBlockNumber()
                void _pollingLogic(currentBlockNumber, () => clearInterval(intervalId))
            }

            // TODO average block time might be undefined and what is the best case for a fallback?
            const pollInterval = (evmNetwork.averageBlockTimeInSeconds ?? 10) * MILLISECONDS_PER_SECOND

            const intervalId = setInterval(() => void _intervalLogic(), pollInterval)
        }
    }
}

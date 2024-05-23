import { updateEvmActivity } from '@core/activity/stores'
import { IEvmNetwork } from '@core/network'
import { LocalEvmTransaction } from '@core/transactions'
import { MILLISECONDS_PER_SECOND } from '@core/utils'

export function startEvmConfirmationPoll(
    transaction: LocalEvmTransaction,
    evmNetwork: IEvmNetwork,
    accountIndex: number
): void {
    const { transactionHash, blockNumber } = transaction
    const pollInterval = evmNetwork.averageBlockTimeInSeconds * MILLISECONDS_PER_SECOND

    const interval = setInterval(async () => {
        const currentBlockNumber = (await evmNetwork.getLatestBlock()).number
        let confirmations = Number(BigInt(currentBlockNumber) - BigInt(blockNumber))
        if (confirmations >= evmNetwork.blocksUntilConfirmed) {
            try {
                await evmNetwork.provider.eth.getTransactionReceipt(transactionHash)
            } catch (error) {
                confirmations = -1
            } finally {
                updateEvmActivity(accountIndex, transactionHash, { confirmations })
                clearInterval(interval)
            }
        } else {
            updateEvmActivity(accountIndex, transactionHash, { confirmations })
        }
    }, pollInterval)
}

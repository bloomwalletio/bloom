import {
    StardustActivity,
    ActivityDirection,
    StardustActivityType,
    PersistedEvmTransaction,
    calculateAndAddPersistedNftBalanceChange,
} from '@core/activity'
import { addAccountActivity } from '@core/activity/stores'
import { generateActivityFromEvmTransaction } from '@core/activity/utils/generateActivityFromEvmTransaction'
import { EvmTransactionData } from '@core/layer-2'
import { EvmNetworkId, IChain } from '@core/network'
import { addLocalTransactionToPersistedTransaction } from '@core/transactions/stores'
import { sendSignedEvmTransaction } from '@core/wallet/actions/sendSignedEvmTransaction'
import { updateL2BalanceWithoutActivity } from '../updateL2BalanceWithoutActivity'
import { IAccountState } from '@core/account'

export async function sendAndPersistTransactionFromEvm(
    preparedTransaction: EvmTransactionData,
    signedTransaction: string,
    chain: IChain,
    account: IAccountState,
    profileId: string
): Promise<string> {
    const transactionReceipt = await sendSignedEvmTransaction(chain, signedTransaction)
    if (!transactionReceipt) {
        throw Error('No transaction receipt!')
    }

    // We manually add a timestamp to mitigate balance change activities
    // taking precedence over send/receive activities
    const evmTransaction: PersistedEvmTransaction = {
        ...preparedTransaction,
        ...transactionReceipt,
        timestamp: Date.now(),
    }
    await persistEvmTransaction(profileId, account, chain, evmTransaction)
    return transactionReceipt.transactionHash
}

async function persistEvmTransaction(
    profileId: string,
    account: IAccountState,
    chain: IChain,
    evmTransaction: PersistedEvmTransaction
): Promise<void> {
    const networkId = chain.getConfiguration().id as EvmNetworkId
    addLocalTransactionToPersistedTransaction(profileId, account.index, networkId, [evmTransaction])

    const activity = await generateActivityFromEvmTransaction(evmTransaction, chain, account)
    if (!activity) {
        return
    }

    addAccountActivity(account.index, activity)

    await createHiddenBalanceChange(account, activity)

    if (activity.recipient?.type === 'account') {
        const recipientAccount = activity.recipient.account
        addLocalTransactionToPersistedTransaction(profileId, recipientAccount.index, networkId, [evmTransaction])
        const receiveActivity = await generateActivityFromEvmTransaction(evmTransaction, chain, recipientAccount)
        if (!receiveActivity) {
            return
        }

        addAccountActivity(recipientAccount.index, receiveActivity)
        await createHiddenBalanceChange(recipientAccount, receiveActivity)
    }
}

// Hidden balance changes mitigate duplicate activities for L2 transactions (balance changed & sent/receive activities).
async function createHiddenBalanceChange(account: IAccountState, activity: StardustActivity): Promise<void> {
    const received = activity.direction === ActivityDirection.Incoming
    const networkId = activity.sourceNetworkId

    if (activity.type === StardustActivityType.Nft) {
        const owned = received ? true : false
        calculateAndAddPersistedNftBalanceChange(account, networkId, activity.nftId, owned, true)
    }
    if (activity.tokenTransfer) {
        const rawAmount = activity.tokenTransfer.rawAmount
        const amount = received ? rawAmount : BigInt(-1) * rawAmount
        await updateL2BalanceWithoutActivity(amount, activity.tokenTransfer.tokenId, account, networkId)
    }

    const rawBaseTokenAmount = received
        ? activity.baseTokenTransfer.rawAmount
        : BigInt(-1) * (activity.baseTokenTransfer.rawAmount + BigInt(activity.transactionFee ?? 0))
    await updateL2BalanceWithoutActivity(rawBaseTokenAmount, activity.baseTokenTransfer.tokenId, account, networkId)
}

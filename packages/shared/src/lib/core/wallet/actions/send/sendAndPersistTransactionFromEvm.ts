import { IAccountState } from '@core/account'
import {
    ActivityDirection,
    StardustActivity,
    StardustActivityType,
    calculateAndAddPersistedNftBalanceChange,
    calculateAndAddPersistedTokenBalanceChange,
} from '@core/activity'
import { addAccountActivity } from '@core/activity/stores'
import { generateEvmActivityFromLocalEvmTransaction } from '@core/activity/utils/evm'
import { EvmTransactionData, isErcAsset } from '@core/layer-2'
import { EvmNetworkId, IChain } from '@core/network'
import { LocalEvmTransaction } from '@core/transactions'
import { addLocalTransactionToPersistedTransaction } from '@core/transactions/stores'
import { sendSignedEvmTransaction } from '@core/wallet/actions/sendSignedEvmTransaction'
import { updateLayer2AccountBalanceForTokenOnChain } from '@core/layer-2/stores'

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
    const evmTransaction: LocalEvmTransaction = {
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
    evmTransaction: LocalEvmTransaction
): Promise<void> {
    const networkId = chain.getConfiguration().id as EvmNetworkId
    addLocalTransactionToPersistedTransaction(profileId, account.index, networkId, [evmTransaction])
    const activity = await generateEvmActivityFromLocalEvmTransaction(evmTransaction, chain, account)
    if (!activity) {
        return
    }

    addAccountActivity(account.index, activity)

    await createHiddenBalanceChange(account, activity)

    if (activity.recipient?.type === 'account') {
        const recipientAccount = activity.recipient.account
        addLocalTransactionToPersistedTransaction(profileId, recipientAccount.index, networkId, [evmTransaction])
        const receiveActivity = await generateEvmActivityFromLocalEvmTransaction(
            evmTransaction,
            chain,
            recipientAccount
        )
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

    if (activity.type === StardustActivityType.Nft && !isErcAsset(activity.nftId)) {
        const owned = received ? true : false
        calculateAndAddPersistedNftBalanceChange(account, networkId, activity.nftId, owned, true)
    }
    if (activity.tokenTransfer && !isErcAsset(activity.tokenTransfer.tokenId)) {
        const tokenId = activity.tokenTransfer.tokenId
        const amount = received ? activity.tokenTransfer.rawAmount : BigInt(-1) * activity.tokenTransfer.rawAmount

        const newBalance = updateLayer2AccountBalanceForTokenOnChain(account.index, networkId, tokenId, amount)
        await calculateAndAddPersistedTokenBalanceChange(account, networkId, tokenId, newBalance, true)
    }
}

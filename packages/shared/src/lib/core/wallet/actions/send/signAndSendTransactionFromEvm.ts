import { getSelectedAccount } from '@core/account/stores'
import { addAccountActivity, addPersistedTransaction } from '@core/activity/stores'
import { EvmTransactionData } from '@core/layer-2'
import { IChain } from '@core/network'
import { signEvmTransaction } from '../signEvmTransaction'
import { generateActivityFromEvmTransaction } from '@core/activity/utils/generateActivityFromEvmTransaction'
import {
    Activity,
    ActivityDirection,
    ActivityType,
    PersistedEvmTransaction,
    calculateAndAddPersistedNftBalanceChange,
} from '@core/activity'
import { IAccountState } from '@core/account'
import { updateL2BalanceWithoutActivity } from '../updateL2BalanceWithoutActivity'
import { sendSignedEvmTransaction } from '@core/wallet/actions/sendSignedEvmTransaction'
import { modifyPopupState } from '../../../../../../../desktop/lib/auxiliary/popup/helpers'

export async function signAndSendTransactionFromEvm(
    preparedTransaction: EvmTransactionData,
    chain: IChain,
    signAndSend: boolean
): Promise<unknown> {
    const account = getSelectedAccount()
    const signedTransaction = await signEvmTransaction(preparedTransaction, chain, account)
    modifyPopupState({ preventClose: true })
    if (!signedTransaction) {
        throw Error('No signed transaction!')
    }
    if (!signAndSend) {
        return signedTransaction
    }

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
    await persistEvmTransaction(evmTransaction, chain, account)
    return transactionReceipt.transactionHash
}

async function persistEvmTransaction(
    evmTransaction: PersistedEvmTransaction,
    chain: IChain,
    account: IAccountState
): Promise<void> {
    addPersistedTransaction(account.index, chain, evmTransaction)

    const activity = await generateActivityFromEvmTransaction(evmTransaction, chain, account)
    if (!activity) {
        return
    }

    addAccountActivity(account.index, activity)

    await createHiddenBalanceChange(account, activity)

    if (activity.recipient?.type === 'account') {
        const recipientAccount = activity.recipient.account
        addPersistedTransaction(recipientAccount.index, chain, evmTransaction)
        const receiveActivity = await generateActivityFromEvmTransaction(evmTransaction, chain, recipientAccount)
        if (!receiveActivity) {
            return
        }

        addAccountActivity(recipientAccount.index, receiveActivity)
        await createHiddenBalanceChange(recipientAccount, receiveActivity)
    }
}

// Hidden balance changes mitigate duplicate activities for L2 transactions (balance changed & sent/receive activities).
async function createHiddenBalanceChange(account: IAccountState, activity: Activity): Promise<void> {
    const received = activity.direction === ActivityDirection.Incoming
    const networkId = activity.sourceNetworkId

    if (activity.type === ActivityType.Nft) {
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

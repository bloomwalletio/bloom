import { getSelectedAccount } from '@core/account/stores'
import { addAccountActivity, addPersistedTransaction } from '@core/activity/stores'
import { EvmTransactionData } from '@core/layer-2'
import { LedgerAppName } from '@core/ledger'
import { IChain } from '@core/network'
import { checkActiveProfileAuth } from '@core/profile/actions'
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
import { getSdkError } from '@walletconnect/utils'
import { modifyPopupState } from '../../../../../../../desktop/lib/auxiliary/popup/helpers'

export async function sendTransactionFromEvm(
    preparedTransaction: EvmTransactionData,
    chain: IChain,
    signAndSend: boolean
): Promise<unknown> {
    const account = getSelectedAccount()
    return new Promise((resolve, reject) => {
        checkActiveProfileAuth(
            async () => {
                try {
                    const signedTransaction = await signEvmTransaction(preparedTransaction, chain, account)
                    modifyPopupState({ preventClose: true })
                    if (!signedTransaction) {
                        reject({ message: 'No signed transaction!', code: 500 })
                        return
                    }
                    if (!signAndSend) {
                        resolve(signedTransaction)
                        return
                    }

                    const transactionReceipt = await sendSignedEvmTransaction(chain, signedTransaction)
                    if (!transactionReceipt) {
                        reject({ message: 'No transaction receipt!', code: 500 })
                        return
                    }

                    // We manually add a timestamp to mitigate balance change activities
                    // taking precedence over send/receive activities
                    const evmTransaction: PersistedEvmTransaction = {
                        ...preparedTransaction,
                        ...transactionReceipt,
                        timestamp: Date.now(),
                    }
                    await persistEvmTransaction(evmTransaction, chain, account)
                    resolve(transactionReceipt.transactionHash)
                } catch (err) {
                    reject(err)
                }
            },
            { stronghold: true, ledger: true, props: { preparedTransaction } },
            LedgerAppName.Ethereum,
            () => {
                reject(getSdkError('USER_REJECTED'))
            }
        )
    })
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

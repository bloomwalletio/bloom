import { getSelectedAccount } from '@core/account/stores'
import { addActivitiesToAccountActivitiesInAllAccountActivities, addPersistedTransaction } from '@core/activity/stores'
import { EvmTransactionData } from '@core/layer-2'
import { LedgerAppName } from '@core/ledger'
import { IChain } from '@core/network'
import { checkActiveProfileAuth } from '@core/profile/actions'
import { signAndSendEvmTransaction } from './signAndSendEvmTransaction'
import { generateActivityFromEvmTransaction } from '@core/activity/utils/generateActivityFromEvmTransaction'
import {
    Activity,
    ActivityDirection,
    ActivityType,
    PersistedEvmTransaction,
    calculateAndAddPersistedNftBalanceChange,
} from '@core/activity'
import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import { updateL2BalanceWithoutActivity } from '../updateL2BalanceWithoutActivity'

export async function sendTransactionFromEvm(
    preparedTransaction: EvmTransactionData,
    chain: IChain,
    callback?: () => void
): Promise<void> {
    const account = getSelectedAccount()
    const provider = chain.getProvider()

    await checkActiveProfileAuth(
        async () => {
            const chainId = chain.getConfiguration().chainId
            const coinType = chain.getConfiguration().coinType
            const transactionReceipt = await signAndSendEvmTransaction(
                preparedTransaction,
                chainId,
                coinType,
                provider,
                account
            )
            if (!transactionReceipt) {
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

            if (callback && typeof callback === 'function') {
                callback()
            }
        },
        { stronghold: true, ledger: true, props: { preparedTransaction } },
        LedgerAppName.Ethereum
    )
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

    addActivitiesToAccountActivitiesInAllAccountActivities(account.index, [activity])
    if (getAddressFromAccountForNetwork(account, chain.getConfiguration().id) !== activity.subject?.address) {
        await createHiddenBalanceChange(account, activity)
    }

    if (activity.recipient?.type === 'account') {
        const recipientAccount = activity.recipient.account
        addPersistedTransaction(recipientAccount.index, chain, evmTransaction)
        const receiveActivity = await generateActivityFromEvmTransaction(evmTransaction, chain, recipientAccount)
        if (!receiveActivity) {
            return
        }

        addActivitiesToAccountActivitiesInAllAccountActivities(recipientAccount.index, [receiveActivity])
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
        const rawAmount = Number(activity.tokenTransfer.rawAmount)
        const amount = received ? rawAmount : -1 * rawAmount
        await updateL2BalanceWithoutActivity(amount, activity.tokenTransfer.tokenId, account, networkId)
    }

    const rawBaseTokenAmount = received
        ? Number(activity.baseTokenTransfer.rawAmount)
        : (Number(activity.baseTokenTransfer.rawAmount) + Number(activity.transactionFee ?? 0)) * -1
    await updateL2BalanceWithoutActivity(rawBaseTokenAmount, activity.baseTokenTransfer.tokenId, account, networkId)
}

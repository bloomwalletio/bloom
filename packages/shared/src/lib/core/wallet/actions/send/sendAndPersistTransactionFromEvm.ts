import { IAccountState } from '@core/account'
import {
    ActivityDirection,
    EvmActivity,
    calculateAndAddPersistedNftBalanceChange,
    calculateAndAddPersistedTokenBalanceChange,
} from '@core/activity'
import { addAccountActivity, updateActivityByActivityId } from '@core/activity/stores'
import { generateBaseEvmActivity, generateEvmActivityFromLocalEvmTransaction } from '@core/activity/utils/evm'
import { EvmTransactionData } from '@core/layer-2'
import { IEvmNetwork } from '@core/network'
import { LocalEvmTransaction } from '@core/transactions'
import { addLocalTransactionToPersistedTransaction } from '@core/transactions/stores'
import { sendSignedEvmTransaction } from '../sendSignedEvmTransaction'
import { updateLayer2AccountBalanceForTokenOnChain } from '@core/layer-2/stores'
import { EvmActivityType } from '@core/activity/enums/evm'
import { NftStandard } from '@core/nfts'
import { TokenStandard } from '@core/token/enums'
import { startEvmConfirmationPoll } from '../../utils'

export async function sendAndPersistTransactionFromEvm(
    preparedTransaction: EvmTransactionData,
    signedTransaction: string,
    evmNetwork: IEvmNetwork,
    profileId: string,
    account: IAccountState
): Promise<string> {
    let transactionHash = ''
    let evmTransaction: LocalEvmTransaction
    let activityId: string | undefined

    return new Promise((resolve, reject) => {
        void sendSignedEvmTransaction(evmNetwork, signedTransaction)
            .on('transactionHash', async (hash) => {
                try {
                    transactionHash = hash
                    evmTransaction = {
                        ...preparedTransaction,
                        status: true,
                        transactionHash: transactionHash.toString(),
                        estimatedGas: Number(preparedTransaction.estimatedGas),
                        nonce: Number(preparedTransaction.nonce),
                        gasLimit: Number(preparedTransaction.gasLimit),
                        timestamp: Date.now(),
                        confirmations: 0,
                        to: preparedTransaction.to?.toString(),
                    }
                    activityId = await persistEvmTransaction(profileId, account, evmNetwork, evmTransaction)
                    resolve(transactionHash)
                } catch (error) {
                    reject(error)
                }
            })
            .on('receipt', async (receipt) => {
                if (!activityId) {
                    return
                }

                evmTransaction = {
                    ...evmTransaction,
                    transactionIndex: Number(receipt.transactionIndex),
                    blockNumber: Number(receipt.blockNumber),
                    from: receipt.from,
                    gasUsed: Number(receipt.gasUsed),
                }

                const activity = await generateBaseEvmActivity(evmTransaction, evmNetwork, account)

                updateActivityByActivityId(account.index, activityId, activity)

                void startEvmConfirmationPoll(evmTransaction, evmNetwork, account.index, profileId)
            })
            .on('error', (error) => {
                reject(error)
            })
    })
}

async function persistEvmTransaction(
    profileId: string,
    account: IAccountState,
    evmNetwork: IEvmNetwork,
    evmTransaction: LocalEvmTransaction
): Promise<string | undefined> {
    const networkId = evmNetwork.id
    addLocalTransactionToPersistedTransaction(profileId, account.index, networkId, [evmTransaction])
    const activity = await generateEvmActivityFromLocalEvmTransaction(evmTransaction, evmNetwork, account)
    if (!activity) {
        return
    }

    addAccountActivity(account.index, activity)

    createHiddenBalanceChange(profileId, account, activity)

    if (activity.recipient?.type === 'account') {
        const recipientAccount = activity.recipient.account
        addLocalTransactionToPersistedTransaction(profileId, recipientAccount.index, networkId, [evmTransaction])
        const receiveActivity = await generateEvmActivityFromLocalEvmTransaction(
            evmTransaction,
            evmNetwork,
            recipientAccount
        )
        if (!receiveActivity) {
            return
        }

        addAccountActivity(recipientAccount.index, receiveActivity)
        createHiddenBalanceChange(profileId, recipientAccount, receiveActivity)
    }

    return activity.id
}

// Hidden balance changes mitigate duplicate activities for L2 transactions (balance changed & sent/receive activities).
function createHiddenBalanceChange(profileId: string, account: IAccountState, activity: EvmActivity): void {
    const received = activity.direction === ActivityDirection.Incoming
    const networkId = activity.sourceNetworkId

    if (activity.type === EvmActivityType.TokenTransfer && activity.tokenTransfer.standard === NftStandard.Irc27) {
        const owned = received ? true : false
        calculateAndAddPersistedNftBalanceChange(
            profileId,
            account,
            networkId,
            activity.tokenTransfer.tokenId,
            owned,
            true
        )
    }
    if (activity.type === EvmActivityType.TokenTransfer && activity.tokenTransfer.standard === TokenStandard.Irc30) {
        const tokenId = activity.tokenTransfer.tokenId
        const amount = received ? activity.tokenTransfer.rawAmount : BigInt(-1) * activity.tokenTransfer.rawAmount

        const newBalance = updateLayer2AccountBalanceForTokenOnChain(account.index, networkId, tokenId, amount)
        calculateAndAddPersistedTokenBalanceChange(profileId, account, networkId, tokenId, newBalance, true)
    }
}

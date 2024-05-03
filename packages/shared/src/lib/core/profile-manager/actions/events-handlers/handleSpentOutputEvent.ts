import { syncBalance } from '@core/account/actions/syncBalance'
import { StardustActivity, StardustActivityAsyncStatus, StardustActivityType } from '@core/activity'
import {
    allAccountActivities,
    updateAsyncDataByTransactionId,
} from '@core/activity/stores/all-account-activities.store'
import { NetworkNamespace } from '@core/network'
import { IIrc27Nft } from '@core/nfts'
import { getNftByIdForAccount, updateNftForAccount } from '@core/nfts/stores'
import { activeAccounts } from '@core/profile/stores'
import { Event, SpentOutputWalletEvent, WalletEventType } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { validateWalletApiEvent } from '../../utils'

export async function handleSpentOutputEvent(error: Error, event: Event): Promise<void> {
    const walletEvent = validateWalletApiEvent<SpentOutputWalletEvent>(error, event, WalletEventType.SpentOutput)
    await handleSpentOutputEventInternal(event.accountIndex, walletEvent)
}

export async function handleSpentOutputEventInternal(
    accountIndex: number,
    walletEvent: SpentOutputWalletEvent
): Promise<void> {
    const account = get(activeAccounts)?.find((account) => account.index === accountIndex)
    const output = walletEvent?.output
    await syncBalance(accountIndex)
    const outputId = output?.outputId
    const activity = get(allAccountActivities)?.[accountIndex]?.find(
        (_activity) => _activity.namespace === NetworkNamespace.Stardust && _activity.outputId === outputId
    ) as StardustActivity | undefined
    if (!activity) {
        return
    }

    if (activity.asyncData?.asyncStatus === StardustActivityAsyncStatus.Unclaimed) {
        const transactionId = output?.metadata?.transactionId
        updateAsyncDataByTransactionId(accountIndex, transactionId, {
            asyncStatus: StardustActivityAsyncStatus.Claimed,
        })
    }

    if (activity.type === StardustActivityType.Nft) {
        const nft = getNftByIdForAccount(accountIndex, activity.nftId) as IIrc27Nft
        const previousOutputId = nft?.latestOutputId
        if (previousOutputId) {
            const previousOutput = await account?.getOutput(previousOutputId)
            if (
                previousOutput &&
                output.metadata.milestoneTimestampBooked > previousOutput.metadata.milestoneTimestampBooked
            ) {
                updateNftForAccount(accountIndex, { id: activity.nftId, isSpendable: false })
            }
        } else {
            throw new Error(`Unable to find latest output ID for NFT ${nft.id}`)
        }
    }
}

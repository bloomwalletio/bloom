import { syncBalance } from '@core/account/actions/syncBalance'
import { getNftByIdFromAllAccountNfts, updateNftInAllAccountNfts } from '@core/nfts'
import { activeAccounts } from '@core/profile/stores'
import { ActivityAsyncStatus, ActivityType } from '@core/activities'
import {
    allAccountActivities,
    updateAsyncDataByTransactionId,
} from '@core/activities/stores/all-account-activities.store'
import { get } from 'svelte/store'
import { validateWalletApiEvent } from '../../utils'
import { Event, SpentOutputWalletEvent, WalletEventType } from '@iota/wallet/out/types'

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
    const activity = get(allAccountActivities)?.[accountIndex]?.find((_activity) => _activity.outputId === outputId)

    if (activity && activity.asyncData?.asyncStatus === ActivityAsyncStatus.Unclaimed) {
        const transactionId = output?.metadata?.transactionId
        updateAsyncDataByTransactionId(accountIndex, transactionId, {
            asyncStatus: ActivityAsyncStatus.Claimed,
        })
    }

    if (activity?.type === ActivityType.Nft) {
        const previousOutputId = getNftByIdFromAllAccountNfts(accountIndex, activity.nftId)?.latestOutputId
        const previousOutput = await account?.getOutput(previousOutputId)
        if (
            previousOutput &&
            output.metadata.milestoneTimestampBooked > previousOutput.metadata.milestoneTimestampBooked
        ) {
            updateNftInAllAccountNfts(accountIndex, activity.nftId, { isSpendable: false })
        }
    }
}

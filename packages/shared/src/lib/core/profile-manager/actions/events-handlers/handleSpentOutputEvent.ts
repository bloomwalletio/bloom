import { syncBalance } from '@core/account/actions/syncBalance'
import { ActivityAsyncStatus, ActivityType } from '@core/activity'
import {
    allAccountActivities,
    updateAsyncDataByTransactionId,
} from '@core/activity/stores/all-account-activities.store'
import { getNftByIdFromAllAccountNfts, updateNftInAllAccountNftsForAccount } from '@core/nfts/actions'
import { activeAccounts } from '@core/profile/stores'
import { get } from 'svelte/store'
import { validateWalletApiEvent } from '../../utils'
import { Event, SpentOutputWalletEvent, WalletEventType } from '@iota/sdk/out/types'
import { IIrc27Nft } from '@core/nfts'

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
        const nft = getNftByIdFromAllAccountNfts(accountIndex, activity.nftId) as IIrc27Nft
        const previousOutputId = nft?.latestOutputId
        if (previousOutputId) {
            const previousOutput = await account?.getOutput(previousOutputId)
            if (
                previousOutput &&
                output.metadata.milestoneTimestampBooked > previousOutput.metadata.milestoneTimestampBooked
            ) {
                updateNftInAllAccountNftsForAccount(accountIndex, activity.nftId, { isSpendable: false })
            }
        } else {
            throw new Error(`Unable to find latest output ID for NFT ${nft.id}`)
        }
    }
}

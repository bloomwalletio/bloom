import { Event, NewOutputWalletEvent, WalletEventType, OutputType } from '@iota/sdk/out/types'
import { syncBalance } from '@core/account/actions/syncBalance'
import { checkAndRemoveProfilePicture } from '@core/profile/actions'
import { activeAccounts } from '@core/profile/stores'
import { IWrappedOutput } from '@core/wallet/interfaces'
import {
    addActivitiesToAccountActivitiesInAllAccountActivities,
    allAccountActivities,
} from '@core/activity/stores/all-account-activities.store'
import { generateActivities } from '@core/activity/utils'
import { preprocessGroupedOutputs } from '@core/activity/utils/outputs'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils/getBech32AddressFromAddressTypes'
import { get } from 'svelte/store'
import { validateWalletApiEvent } from '../../utils'
import { ActivityType } from '@core/activity/enums'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { addPersistedToken } from '@core/token/stores'
import { addNftsToDownloadQueue, addOrUpdateNftInAllAccountNfts, buildNftFromNftOutput } from '@core/nfts/actions'

export function handleNewOutputEvent(error: Error, event: Event): void {
    const walletEvent = validateWalletApiEvent<NewOutputWalletEvent>(error, event, WalletEventType.NewOutput)
    void handleNewOutputEventInternal(event.accountIndex, walletEvent)
}

export async function handleNewOutputEventInternal(
    accountIndex: number,
    walletEvent: NewOutputWalletEvent
): Promise<void> {
    const account = get(activeAccounts)?.find((account) => account.index === accountIndex)
    const output = walletEvent?.output

    if (!account || !output) return

    const address = getBech32AddressFromAddressTypes(output?.address)
    const isNewAliasOutput =
        output.output.type === OutputType.Alias &&
        output.output.stateIndex === 0 &&
        !get(allAccountActivities)[accountIndex].find((_activity) => _activity.id === output.outputId)
    const isNftOutput = output.output.type === OutputType.Nft

    if ((account?.depositAddress === address && !output?.remainder) || isNewAliasOutput) {
        await syncBalance(account.index)

        const processedOutput = preprocessGroupedOutputs([output], walletEvent?.transactionInputs ?? [], account)

        const activities = generateActivities(processedOutput, account)
        for (const activity of activities) {
            if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
                const token = await getOrRequestTokenFromPersistedTokens(activity.tokenId)
                addPersistedToken(token)
            }
        }
        addActivitiesToAccountActivitiesInAllAccountActivities(account.index, activities)
    }

    if (isNftOutput) {
        const nft = buildNftFromNftOutput(output as IWrappedOutput, account.depositAddress)
        addOrUpdateNftInAllAccountNfts(account.index, nft)
        void addNftsToDownloadQueue(accountIndex, [nft])

        checkAndRemoveProfilePicture()
    }
}

import { Event, NewOutputWalletEvent, WalletEventType, OutputType, AliasOutput } from '@iota/sdk/out/types'
import { syncBalance } from '@core/account/actions/syncBalance'
import { ActivityType } from '@core/activity/enums'
import { checkAndRemoveProfilePicture } from '@core/profile/actions'
import { activeAccounts } from '@core/profile/stores'
import { IWrappedOutput } from '@core/wallet/interfaces'
import {
    addActivitiesToAccountActivitiesInAllAccountActivities,
    allAccountActivities,
} from '@core/activity/stores/all-account-activities.store'
import { generateActivities } from '@core/activity/utils'
import { preprocessGroupedOutputs } from '@core/activity/utils/outputs'
import { getActiveNetworkId } from '@core/network'
import { addNftsToDownloadQueue, addOrUpdateNftInAllAccountNfts, buildNftFromNftOutput } from '@core/nfts/actions'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils/getBech32AddressFromAddressTypes'
import { get } from 'svelte/store'
import { validateWalletApiEvent } from '../../utils'

export function handleNewOutputEvent(error: Error, event: Event): void {
    const walletEvent = validateWalletApiEvent<NewOutputWalletEvent>(error, event, WalletEventType.NewOutput)
    void handleNewOutputEventInternal(event.accountIndex, walletEvent)
}

export async function handleNewOutputEventInternal(
    accountIndex: number,
    walletEvent: NewOutputWalletEvent
): Promise<void> {
    const account = get(activeAccounts)?.find((account) => account.index === accountIndex)
    const networkId = getActiveNetworkId()
    const output = walletEvent?.output

    if (!account || !output || !networkId) return

    const address = getBech32AddressFromAddressTypes(output?.address)
    const outputData = output.output as AliasOutput
    const isNewAliasOutput =
        outputData.type === OutputType.Alias &&
        outputData.stateIndex === 0 &&
        !get(allAccountActivities)[accountIndex].find((_activity) => _activity.id === output.outputId)

    const isNftOutput = outputData.type === OutputType.Nft

    if ((account?.depositAddress === address && !output?.remainder) || isNewAliasOutput) {
        await syncBalance(account.index)

        const processedOutput = preprocessGroupedOutputs([output], walletEvent?.transactionInputs ?? [], account)

        const activities = await generateActivities(processedOutput, account, networkId)
        for (const activity of activities) {
            if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
                const tokenId = activity.tokenTransfer?.tokenId ?? activity.baseTokenTransfer?.tokenId
                getOrRequestTokenFromPersistedTokens(tokenId, activity.sourceNetworkId)
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

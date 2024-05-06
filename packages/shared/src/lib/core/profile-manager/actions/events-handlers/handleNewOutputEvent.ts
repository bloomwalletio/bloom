import { Event, NewOutputWalletEvent, WalletEventType, OutputType, AliasOutput } from '@iota/sdk/out/types'
import { syncBalance } from '@core/account/actions/syncBalance'
import { StardustActivityType } from '@core/activity/enums'
import { checkAndRemoveProfilePicture } from '@core/profile/actions'
import { activeAccounts } from '@core/profile/stores'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { addAccountActivities, allAccountActivities } from '@core/activity/stores/all-account-activities.store'
import { generateActivitiesFromStardustNetwork } from '@core/activity/utils'
import { preprocessGroupedOutputs } from '@core/activity/utils/outputs'
import { getActiveNetworkId } from '@core/network'
import { addNftsToDownloadQueue, buildNftFromNftOutput } from '@core/nfts/actions'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils/getBech32AddressFromAddressTypes'
import { get } from 'svelte/store'
import { validateWalletApiEvent } from '../../utils'
import { addOrUpdateNftForAccount } from '@core/nfts/stores'

export function handleNewOutputEvent(error: Error, event: Event): void {
    const walletEvent = validateWalletApiEvent<NewOutputWalletEvent>(error, event, WalletEventType.NewOutput)
    void handleNewOutputEventInternal(event.accountIndex, walletEvent)
}

export async function handleNewOutputEventInternal(
    accountIndex: number,
    walletEvent: NewOutputWalletEvent
): Promise<void> {
    const account = get(activeAccounts)?.find((account) => account.index === accountIndex)
    if (!account) {
        return
    }

    const networkId = getActiveNetworkId()
    const output = walletEvent.output

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

        const activities = await generateActivitiesFromStardustNetwork(processedOutput, account, networkId)
        for (const activity of activities) {
            if (activity.type === StardustActivityType.Basic || activity.type === StardustActivityType.Foundry) {
                const tokenId = activity.tokenTransfer?.tokenId ?? activity.baseTokenTransfer?.tokenId
                getOrRequestTokenFromPersistedTokens(tokenId, activity.sourceNetworkId)
            }
        }
        addAccountActivities(account.index, activities)
    }

    if (isNftOutput) {
        const nft = buildNftFromNftOutput(output as IWrappedOutput, networkId, account.depositAddress)
        addOrUpdateNftForAccount(account.index, nft)
        void addNftsToDownloadQueue([nft])

        checkAndRemoveProfilePicture()
    }
}

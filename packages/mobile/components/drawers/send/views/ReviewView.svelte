<script lang="ts">
    import { get } from 'svelte/store'

    import { ExpirationTimePicker } from '@components'
    import { ActivityInformation, BasicActivityDetails, Button, KeyValueBox, TextHint, Toggle } from '@ui'

    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { getDestinationNetworkFromAddress } from '@core/layer-2'
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import { TimePeriod } from '@core/utils'
    import {
        ActivityDirection,
        ActivityType,
        InclusionState,
        newTransactionData,
        NewTransactionType,
        selectedAccountAssets,
    } from '@core/wallet'
    import { ActivityAction } from '@core/wallet/enums'

    import { DrawerId, openDrawer } from '@/auxiliary/drawer'
    import { sendRouter } from '@/routers'
    import { activeProfile } from '@core/profile'

    export let sendTransaction: () => Promise<void>
    export let storageDeposit: number
    export let initialExpirationDate: TimePeriod
    export let expirationDate: Date
    export let visibleSurplus: number = 0

    const { recipient, giftStorageDeposit, surplus, disableChangeExpiration, disableToggleGift, layer2Parameters } =
        get(newTransactionData)

    let loading: boolean = false

    // need to store the newTransactionData to avoid errors
    let transactionData = get(newTransactionData)
    // need to update the variable only when newTransactionData is not reset
    $: if ($newTransactionData.recipient) {
        transactionData = $newTransactionData
    }

    $: isInternal = recipient?.type === 'account'
    $: isTransferring = $selectedAccount.isTransferring
    $: hideGiftToggle =
        (transactionData.type === NewTransactionType.TokenTransfer &&
            transactionData.asset.id === $selectedAccountAssets[$activeProfile?.network?.id]?.baseCoin?.id) ||
        (disableToggleGift && !giftStorageDeposit) ||
        layer2Parameters !== undefined

    $: activity = {
        ...transactionData,
        storageDeposit,
        subject: recipient,
        isInternal,
        giftedStorageDeposit: 0,
        surplus: visibleSurplus,
        type: ActivityType.Basic,
        direction: ActivityDirection.Outgoing,
        inclusionState: InclusionState.Pending,
        action: ActivityAction.Send,
        destinationNetwork: getDestinationNetworkFromAddress(layer2Parameters?.networkAddress),
    }

    async function asyncSendTransaction(): Promise<void> {
        try {
            loading = true
            await sendTransaction()
        } catch (err) {
            loading = false
        } finally {
            loading = false
        }
    }

    async function onSendClick(): Promise<void> {
        const isUnlocked = await isStrongholdUnlocked()
        const _onConfirm = async (): Promise<void> => {
            await asyncSendTransaction()
            $sendRouter.next()
        }
        if (isUnlocked) {
            _onConfirm()
        } else {
            openDrawer(DrawerId.EnterPassword, { onSuccess: _onConfirm })
        }
    }

    function onAddReferenceClick(): void {
        openDrawer(DrawerId.References)
    }

    function onAddExpirationClick(): void {
        openDrawer(DrawerId.Expiration)
    }

    function toggleGiftStorageDeposit(): void {
        newTransactionData.update((details) => ({ ...details, giftStorageDeposit: !details.giftStorageDeposit }))
    }
</script>

<div class="w-full overflow-y-auto flex flex-col flex-auto h-1 justify-between">
    <div class="flex flex-row flex-1 justify-center relative">
        <div class="w-full flex-col space-y-6 pt-10">
            <BasicActivityDetails {activity} />
            <div class="flex flex-col space-y-2">
                <ActivityInformation {activity} />
                {#if !hideGiftToggle}
                    <KeyValueBox keyText={localize('general.giftStorageDeposit')}>
                        <Toggle
                            slot="value"
                            color="green"
                            disabled={$newTransactionData.disableToggleGift}
                            active={$newTransactionData.giftStorageDeposit}
                            onClick={toggleGiftStorageDeposit}
                        />
                    </KeyValueBox>
                {/if}
                {#if initialExpirationDate !== undefined}
                    <KeyValueBox keyText={localize('general.expirationTime')}>
                        <ExpirationTimePicker
                            slot="value"
                            bind:value={expirationDate}
                            disabled={disableChangeExpiration}
                            onClick={onAddExpirationClick}
                        />
                    </KeyValueBox>
                {/if}
                {#if surplus}
                    <TextHint warning text={localize('popups.transaction.surplusIncluded')} />
                {/if}
            </div>
        </div>
    </div>
    <div class="flex flex-col space-y-4">
        <Button outline onClick={onAddReferenceClick} disabled={loading || isTransferring} classes="w-full">
            {localize('actions.addReference')}
        </Button>
        <Button
            isBusy={loading || isTransferring}
            onClick={onSendClick}
            disabled={loading || isTransferring}
            classes="w-full"
        >
            {localize('actions.send')}
        </Button>
    </div>
</div>

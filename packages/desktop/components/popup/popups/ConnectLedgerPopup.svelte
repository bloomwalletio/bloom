<script lang="ts">
    import { Alert, Button, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName, LedgerConnectionState, ledgerConnectionState } from '@core/ledger'
    import { isFunction } from '@core/utils'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { LedgerAnimation } from '@ui'

    export let ledgerAppName: LedgerAppName
    export let onCancel: () => void
    export let onContinue: () => void

    $: isDisconnected = $ledgerConnectionState === LedgerConnectionState.Disconnected
    $: isLocked = $ledgerConnectionState === LedgerConnectionState.Locked
    $: isCorrectAppOpen = ledgerAppName as unknown as LedgerConnectionState

    let illustration: string
    $: $ledgerConnectionState, setAnimation()
    function setAnimation(): void {
        if (isDisconnected) {
            illustration = 'ledger-disconnected'
        } else if (isLocked) {
            illustration = 'ledger-locked'
        } else if (isCorrectAppOpen) {
            illustration = 'ledger-confirm'
        } else {
            illustration = `ledger-open-${ledgerAppName}`
        }
    }

    function onCancelClick(): void {
        if (isFunction(onCancel)) {
            closePopup()
            onCancel()
        } else {
            closePopup()
        }
    }

    function onContinueClick(): void {
        if (isFunction(onContinue)) {
            closePopup()
            onContinue()
        } else {
            closePopup()
        }
    }
</script>

<connect-ledger-popup class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type="h6" classes="text-left">
        {localize('popups.ledgerNotConnected.title')}
    </Text>
    <LedgerAnimation {illustration} />
    {#if isDisconnected}
        <Alert variant="danger" text={localize('popups.ledgerNotConnected.notConnected')} />
    {:else if isLocked}
        <Alert variant="warning" text={localize('popups.ledgerNotConnected.locked')} />
    {:else if isCorrectAppOpen}
        <Alert variant="success" text={localize('popups.ledgerNotConnected.correctAppOpen')} />
    {:else}
        <Alert variant="info" text={localize('popups.ledgerNotConnected.appNotOpen', { appName: ledgerAppName })} />
    {/if}
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button width="full" variant="outline" on:click={onCancelClick} text={localize('actions.cancel')} />
        <Button
            width="full"
            disabled={!isCorrectAppOpen}
            on:click={onContinueClick}
            text={localize('actions.continue')}
        />
    </popup-buttons>
</connect-ledger-popup>

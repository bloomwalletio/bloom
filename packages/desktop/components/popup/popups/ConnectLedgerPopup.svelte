<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName, LedgerConnectionState, ledgerConnectionState } from '@core/ledger'
    import { isFunction } from '@core/utils'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { Button, FontWeight, LedgerAnimation, Text, TextType } from '@ui'

    export let ledgerAppName: LedgerAppName
    export let onCancel: () => void
    export let onContinue: () => void

    $: isDisconnected = $ledgerConnectionState === LedgerConnectionState.Disconnected
    $: isLocked = $ledgerConnectionState === LedgerConnectionState.Locked
    $: isCorrectAppOpen = $ledgerConnectionState === (ledgerAppName as unknown as LedgerConnectionState)

    let illustration: string
    $: $ledgerConnectionState, setAnimation()
    function setAnimation(): void {
        if (isDisconnected) {
            illustration = 'ledger-disconnected-desktop'
        } else if (isLocked) {
            // TODO: get animation for locked state
            illustration = undefined
        } else if (isCorrectAppOpen) {
            illustration = 'ledger-connected-desktop'
        } else {
            illustration = 'ledger-app-closed-desktop'
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
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
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
        <Button classes="w-full" outline onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" disabled={!isCorrectAppOpen} onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </popup-buttons>
</connect-ledger-popup>

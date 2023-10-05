<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName, LedgerConnectionState, ledgerConnectionState } from '@core/ledger'
    import { isFunction } from '@core/utils'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { LedgerAnimation } from '@ui'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let ledgerAppName: LedgerAppName
    export let onCancel: () => void
    export let onContinue: () => void

    $: isDisconnected = $ledgerConnectionState === LedgerConnectionState.Disconnected
    $: isLocked = $ledgerConnectionState === LedgerConnectionState.Locked
    $: isCorrectAppOpen = $ledgerConnectionState === (ledgerAppName as unknown as LedgerConnectionState)

    let illustration: string
    $: $ledgerConnectionState, setIllustration()
    function setIllustration(): void {
        if (isDisconnected) {
            illustration = 'ledger-disconnected'
        } else if (isLocked) {
            illustration = 'ledger-locked'
        } else if (isCorrectAppOpen) {
            illustration = 'ledger-confirm'
        } else {
            illustration = `ledger-open-${ledgerAppName.toLowerCase()}`
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

    const backButton = {
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }

    $: continueButton = {
        text: localize('actions.continue'),
        onClick: onContinueClick,
        disabled: !isCorrectAppOpen,
    }
</script>

<PopupTemplate title={localize('popups.ledgerNotConnected.title')} {backButton} {continueButton}>
    <div class="space-y-6">
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
    </div>
</PopupTemplate>

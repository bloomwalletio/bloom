<script lang="ts">
    import { Alert, Pill } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName, LedgerConnectionState, ledgerConnectionState } from '@core/ledger'
    import { isFunction } from '@core/utils'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { LedgerAnimation, Pane } from '@ui'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let ledgerAppName: LedgerAppName
    export let onCancel: () => void
    export let onContinue: () => void

    $: isDisconnected = $ledgerConnectionState === LedgerConnectionState.Disconnected
    $: isLocked = $ledgerConnectionState === LedgerConnectionState.Locked
    $: isCorrectAppOpen = $ledgerConnectionState === (ledgerAppName as unknown as LedgerConnectionState)

    let ledgerSectionProps: { illustration: string; color: string; text: string; pillText: string | undefined }
    $: $ledgerConnectionState, setLedgerSectionProps()
    function setLedgerSectionProps(): void {
        if (isDisconnected) {
            ledgerSectionProps = {
                illustration: 'ledger-disconnected',
                color: 'danger',
                text: localize('popups.ledgerNotConnected.notConnected'),
                pillText: localize('pills.ledgerStatus.notConnected'),
            }
        } else if (isLocked) {
            ledgerSectionProps = {
                illustration: 'ledger-locked',
                color: 'warning',
                text: localize('popups.ledgerNotConnected.locked'),
                pillText: localize('pills.ledgerStatus.locked'),
            }
        } else if (isCorrectAppOpen) {
            ledgerSectionProps = {
                illustration: 'ledger-confirm',
                color: 'success',
                text: localize('popups.ledgerNotConnected.correctAppOpen'),
                pillText: undefined,
            }
        } else {
            ledgerSectionProps = {
                illustration: `ledger-open-${ledgerAppName.toLowerCase()}`,
                color: 'warning',
                text: localize('popups.ledgerNotConnected.appNotOpen', { appName: ledgerAppName }),
                pillText: localize('pills.ledgerStatus.appNotOpen'),
            }
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
        <Pane classes="flex relative box-border pl-4 pt-4">
            {#if ledgerSectionProps.pillText}
                <status-pill class="absolute">
                    <Pill color={ledgerSectionProps.color}>{ledgerSectionProps.pillText}</Pill>
                </status-pill>
            {/if}
            <LedgerAnimation illustration={ledgerSectionProps.illustration} />
        </Pane>
        <Alert variant={ledgerSectionProps.color} text={ledgerSectionProps.text} />
    </div>
</PopupTemplate>

<style lang="postcss">
    pane {
        @apply box-border pl-4 pt-4;
    }
</style>

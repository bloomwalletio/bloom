<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName, LedgerConnectionState, ledgerConnectionState } from '@core/ledger'
    import { isFunction } from '@core/utils'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { LedgerStatusIllustration } from '@ui'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { LedgerIllustrationVariant } from '@ui/atoms/ledger-illustration-variant.enum'

    export let ledgerAppName: LedgerAppName
    export let onCancel: () => void
    export let onContinue: () => void

    $: isDisconnected = $ledgerConnectionState === LedgerConnectionState.Disconnected
    $: isLocked = $ledgerConnectionState === LedgerConnectionState.Locked
    $: isCorrectAppOpen = $ledgerConnectionState === (ledgerAppName as unknown as LedgerConnectionState)

    let ledgerSectionProps: { color: string; text: string; variant: LedgerIllustrationVariant }
    $: $ledgerConnectionState, setLedgerSectionProps()
    function setLedgerSectionProps(): void {
        if (isDisconnected) {
            ledgerSectionProps = {
                color: 'danger',
                text: localize('popups.ledgerNotConnected.notConnected'),
                variant: LedgerIllustrationVariant.Danger,
            }
        } else if (isLocked) {
            ledgerSectionProps = {
                color: 'warning',
                text: localize('popups.ledgerNotConnected.locked'),
                variant: LedgerIllustrationVariant.Pin,
            }
        } else if (isCorrectAppOpen) {
            ledgerSectionProps = {
                color: 'success',
                text: localize('popups.ledgerNotConnected.correctAppOpen'),
                variant: LedgerIllustrationVariant.Success,
            }
        } else {
            ledgerSectionProps = {
                color: 'warning',
                text: localize('popups.ledgerNotConnected.appNotOpen', { appName: ledgerAppName }),
                variant: LedgerIllustrationVariant.OpenEthereum,
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
        <LedgerStatusIllustration variant={ledgerSectionProps.variant} class="h-[254px]" />,
        <Alert variant={ledgerSectionProps.color} text={ledgerSectionProps.text} />,
    </div>
</PopupTemplate>

<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import {
        LedgerAppName,
        LedgerConnectionState,
        MINIMUM_SUPPORTED_LEDGER_APP_VERSION,
        ledgerConnectionAppState,
    } from '@core/ledger'
    import { closeProfileAuthPopup } from '@desktop/auxiliary/popup'
    import { LedgerStatusIllustration, LedgerIllustrationVariant } from '@ui'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let ledgerAppName: LedgerAppName
    export let onSuccess: () => void

    $: isDisconnected = $ledgerConnectionAppState?.state === LedgerConnectionState.Disconnected
    $: isLocked = $ledgerConnectionAppState?.state === LedgerConnectionState.Locked
    $: isOpen = $ledgerConnectionAppState?.state === LedgerConnectionState.AppOpen
    $: isCorrectApp = $ledgerConnectionAppState?.app === ledgerAppName
    $: isUnsupportedVersion = $ledgerConnectionAppState?.state === LedgerConnectionState.UnsupportedVersion
    $: minimumVersion = MINIMUM_SUPPORTED_LEDGER_APP_VERSION[ledgerAppName]

    let ledgerSectionProps: { color: string; text: string; variant: LedgerIllustrationVariant }
    $: $ledgerConnectionAppState, setLedgerSectionProps()
    function setLedgerSectionProps(): void {
        if (isOpen && isCorrectApp) {
            continueFlow()
        } else if (isDisconnected) {
            ledgerSectionProps = {
                color: 'danger',
                text: localize('popups.ledgerNotConnected.notConnected'),
                variant: LedgerIllustrationVariant.NotConnected,
            }
        } else if (isLocked) {
            ledgerSectionProps = {
                color: 'warning',
                text: localize('popups.ledgerNotConnected.locked'),
                variant: LedgerIllustrationVariant.Pin,
            }
        } else if (isCorrectApp && isUnsupportedVersion) {
            ledgerSectionProps = {
                color: 'danger',
                text: localize('popups.ledgerNotConnected.unsupportedVersion', {
                    appName: ledgerAppName,
                    minimumVersion,
                }),
                variant: LedgerIllustrationVariant.UnsupportedVersion,
            }
        } else {
            const variant = getIllustrationVariant(ledgerAppName)
            ledgerSectionProps = {
                color: 'warning',
                text: localize('popups.ledgerNotConnected.appNotOpen', { appName: ledgerAppName }),
                variant,
            }
        }
    }

    function getIllustrationVariant(appName: LedgerAppName): LedgerIllustrationVariant {
        switch (appName) {
            case LedgerAppName.Iota:
                return LedgerIllustrationVariant.OpenIota
            case LedgerAppName.Shimmer:
                return LedgerIllustrationVariant.OpenShimmer
            case LedgerAppName.Ethereum:
                return LedgerIllustrationVariant.OpenEthereum
            default:
                return LedgerIllustrationVariant.Warning
        }
    }

    function continueFlow(): void {
        closeProfileAuthPopup()
        onSuccess?.()
    }

    function onCancelClick(): void {
        closeProfileAuthPopup({ callOnCancel: true })
    }

    const backButton = {
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }
</script>

<PopupTemplate title={localize('popups.ledgerNotConnected.title')} {backButton}>
    <div class="space-y-6">
        <LedgerStatusIllustration variant={ledgerSectionProps.variant} />
        <Alert variant={ledgerSectionProps.color} text={ledgerSectionProps.text} />
    </div>
</PopupTemplate>

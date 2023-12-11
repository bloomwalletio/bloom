<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName, LedgerConnectionState, ledgerConnectionState } from '@core/ledger'
    import { isFunction } from '@core/utils'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { LedgerStatusIllustration, LedgerIllustrationVariant } from '@ui'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let ledgerAppName: LedgerAppName
    export let onContinue: () => void

    $: isDisconnected = $ledgerConnectionState === LedgerConnectionState.Disconnected
    $: isLocked = $ledgerConnectionState === LedgerConnectionState.Locked
    $: isCorrectAppOpen = $ledgerConnectionState === (ledgerAppName as unknown as LedgerConnectionState)

    let ledgerSectionProps: { color: string; text: string; variant: LedgerIllustrationVariant }
    $: $ledgerConnectionState, setLedgerSectionProps()
    function setLedgerSectionProps(): void {
        if (isCorrectAppOpen) {
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
        }
    }

    function continueFlow(): void {
        if (isFunction(onContinue)) {
            closePopup()
            onContinue()
        } else {
            closePopup()
        }
    }

    function onCancelClick(): void {
        closePopup({ callOnCancel: true })
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

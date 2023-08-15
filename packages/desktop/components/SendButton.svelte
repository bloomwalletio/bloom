<script lang="ts">
    import { localize } from '@core/i18n'
    import { resetLedgerPreparedOutput, resetShowInternalVerificationPopup } from '@core/ledger'
    import { resetSendFlowParameters } from '@core/wallet'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { OnboardingButton } from '@ui'
    import { SendFlowRouter, sendFlowRouter } from '@routes/dashboard/send-flow'

    function onSendClick(): void {
        resetSendFlowParameters()
        resetLedgerPreparedOutput()
        resetShowInternalVerificationPopup()
        sendFlowRouter.set(new SendFlowRouter(undefined))
        openPopup({
            id: PopupId.SendFlow,
            overflow: true,
        })
    }
</script>

<OnboardingButton
    primaryText={localize('general.sendAssets')}
    secondaryText={localize('general.sendAssetToAddress')}
    onClick={onSendClick}
/>

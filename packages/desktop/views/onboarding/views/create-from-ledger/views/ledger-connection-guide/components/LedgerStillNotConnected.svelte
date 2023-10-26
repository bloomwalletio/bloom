<script lang="ts">
    import { Link, Text } from '@bloomwalletio/ui'
    import { LedgerIllustration } from '@ui'
    import { localize } from '@core/i18n'
    import { openUrlInBrowser } from '@core/app'

    const LEDGER_USB_TROUBLESHOOTING_URL: string =
        'https://support.ledger.com/hc/en-us/articles/115005165269-Fix-USB-connection-issues-with-Ledger-Live?support=true'

    function onLinkClick(): void {
        openUrlInBrowser(LEDGER_USB_TROUBLESHOOTING_URL)
    }
</script>

<div class="flex flex-row justify-center items-center">
    <Text type="body2" textColor="secondary" align="center">
        {localize('views.onboarding.createFromLedger.ledgerConnectionGuide.ledgerStillNotConnected.question')}
    </Text>
    &nbsp;
    <Link
        text={localize('views.onboarding.createFromLedger.ledgerConnectionGuide.ledgerStillNotConnected.answer')}
        textType="body2"
        on:click={onLinkClick}
        external
    />
</div>
<div class="flex justify-center items-center">
    <LedgerIllustration />
</div>

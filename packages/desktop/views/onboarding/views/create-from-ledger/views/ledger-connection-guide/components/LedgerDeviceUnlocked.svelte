<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { Illustration, LedgerIllustration } from '@ui'
    import { localize } from '@core/i18n'
</script>

<Text type="body2" textColor="secondary" align="center">
    {localize('views.onboarding.createFromLedger.ledgerConnectionGuide.ledgerDeviceUnlocked')}
</Text>
<div class="flex justify-center items-center">
    <LedgerIllustration showArrows>
        <Illustration illustration="ledger-pin" />
    </LedgerIllustration>
</div>

<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { LedgerIllustration } from '@ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName } from '@core/ledger'

    export let appName: LedgerAppName = LedgerAppName.Shimmer
</script>

<Text type="body2" textColor="secondary" align="center">
    {localize('views.onboarding.createFromLedger.ledgerConnectionGuide.ledgerAppOpen', { appName })}
</Text>
<div class="flex justify-center items-center">
    <LedgerIllustration />
</div>

<script lang="ts">
    import { Avatar, IconName, Text } from '@bloomwalletio/ui'
    import { LedgerIllustration } from '@ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName } from '@core/ledger'
</script>

<Text type="body2" textColor="secondary" align="center">
    {localize('views.onboarding.createFromLedger.ledgerConnectionGuide.ledgerAppOpen', {
        appName: LedgerAppName.Shimmer,
    })}
</Text>
<div class="flex justify-center items-center">
    <LedgerIllustration showArrows>
        <Avatar
            icon={IconName.Shimmer}
            size="md"
            shape="square"
            customTextColor="shimmer"
            backgroundColor="shimmer-background"
        />
    </LedgerIllustration>
</div>

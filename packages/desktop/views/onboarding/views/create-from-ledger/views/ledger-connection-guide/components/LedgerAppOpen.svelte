<script lang="ts">
    import { Avatar, IconName, Text } from '@bloomwalletio/ui'
    import { LedgerIllustration } from '@ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName } from '@core/ledger'
    import { getProfileLedgerAppName } from '@core/profile/actions/active-profile'

    const ledgerAppName = getProfileLedgerAppName()
    const icon = ledgerAppName === LedgerAppName.Iota ? IconName.Iota : IconName.Shimmer
</script>

<Text type="body2" textColor="secondary" align="center">
    {localize('views.onboarding.createFromLedger.ledgerConnectionGuide.ledgerAppOpen', {
        appName: ledgerAppName,
    })}
</Text>
<div class="flex justify-center items-center">
    <LedgerIllustration showArrows>
        <Avatar {icon} size="md" shape="square" customTextColor={icon} backgroundColor="shimmer-background" />
    </LedgerIllustration>
</div>

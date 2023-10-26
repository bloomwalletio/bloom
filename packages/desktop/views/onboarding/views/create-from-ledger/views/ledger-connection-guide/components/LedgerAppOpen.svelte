<script lang="ts">
    import { Avatar, IconName, Text } from '@bloomwalletio/ui'
    import { LedgerIllustration, Logo } from '@ui'
    import { LogoName } from '@auxiliary/logo'
    import { localize } from '@core/i18n'
    import { LedgerAppName } from '@core/ledger'

    export let appName: LedgerAppName = LedgerAppName.Shimmer
</script>

<Text type="body2" textColor="secondary" align="center">
    {localize('views.onboarding.createFromLedger.ledgerConnectionGuide.ledgerAppOpen', { appName })}
</Text>
<div class="flex justify-center items-center">
    <LedgerIllustration showArrows>
        {#if appName === LedgerAppName.Ethereum}
            <Avatar size="md" shape="square" backgroundColor="ethereum">
                <Logo logo={LogoName.Ethereum} />
            </Avatar>
        {:else if appName === LedgerAppName.Shimmer}
            <Avatar
                icon={IconName.Shimmer}
                size="md"
                shape="square"
                customTextColor="shimmer"
                backgroundColor="shimmer-background"
            />
        {/if}
    </LedgerIllustration>
</div>

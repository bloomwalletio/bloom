<script lang="ts">
    import { Avatar, IconName, Text } from '@bloomwalletio/ui'
    import { LedgerIllustration } from '@ui'
    import { localize } from '@core/i18n'
</script>

<Text type="body2" textColor="secondary" align="center">
    {localize('views.onboarding.createFromLedger.ledgerConnectionGuide.ledgerLiveNotOpen')}
</Text>
<div class="flex flex-col justify-center items-center">
    <LedgerIllustration illustration="ledger-live">
        <div class="cross-avatar">
            <Avatar icon={IconName.CrossClose} size="md" backgroundColor="red-500" />
        </div>
    </LedgerIllustration>
</div>

<style lang="postcss">
    .cross-avatar {
        transform: translateY(52px);
    }
</style>

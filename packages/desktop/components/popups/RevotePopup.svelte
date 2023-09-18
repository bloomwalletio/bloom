<script lang="ts">
    import { Button, HTMLButtonType, Text, TextType } from '@ui'
    import { Alert } from '@bloomwalletio/ui'
    import { vote } from '@contexts/governance/actions'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { closePopup } from '@desktop/auxiliary/popup'

    $: hasGovernanceTransactionInProgress =
        $selectedAccount?.hasVotingPowerTransactionInProgress || $selectedAccount?.hasVotingTransactionInProgress

    async function onSubmit(): Promise<void> {
        await checkActiveProfileAuth(async () => {
            await vote()
            closePopup(true)
        })
    }
</script>

<form id="manage-voting-power" class="space-y-5" on:submit|preventDefault={onSubmit}>
    <Text type={TextType.h4} classes="mb-3">{localize('popups.revote.title')}</Text>
    <Text type={TextType.p}>{localize('popups.revote.body')}</Text>
    <Alert variant="info" text={localize('popups.revote.hint')} />
    <Button
        type={HTMLButtonType.Submit}
        disabled={hasGovernanceTransactionInProgress}
        isBusy={hasGovernanceTransactionInProgress}
        classes="w-full"
    >
        {localize('actions.revote')}
    </Button>
</form>

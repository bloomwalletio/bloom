<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { vote } from '@contexts/governance/actions'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuthAsync } from '@core/profile/actions'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { PopupTemplate } from '@components/popup'

    $: hasGovernanceTransactionInProgress =
        $selectedAccount?.hasVotingPowerTransactionInProgress || $selectedAccount?.hasVotingTransactionInProgress

    async function onSubmit(): Promise<void> {
        try {
            await checkActiveProfileAuthAsync()
        } catch (error) {
            return
        }

        await vote()
        closePopup({ forceClose: true })
    }

    function onCancelClick(): void {
        closePopup({ forceClose: true })
    }
</script>

<PopupTemplate
    title={localize('popups.revote.title')}
    description={localize('popups.revote.body')}
    backButton={{ text: localize('actions.cancel'), onClick: onCancelClick }}
    continueButton={{
        type: 'submit',
        text: localize('actions.revote'),
        form: 'manage-voting-power',
    }}
    busy={hasGovernanceTransactionInProgress}
>
    <form id="manage-voting-power" class="space-y-4" on:submit|preventDefault={onSubmit}>
        <Alert variant="info" text={localize('popups.revote.hint')} />
    </form>
</PopupTemplate>

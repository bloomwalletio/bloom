<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { stopVotingForProposal } from '@contexts/governance/actions'
    import { selectedProposal } from '@contexts/governance/stores'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuthAsync } from '@core/profile/actions'
    import { closePopup } from '@desktop/auxiliary/popup'
    import PopupTemplate from '../PopupTemplate.svelte'

    $: hasGovernanceTransactionInProgress =
        $selectedAccount?.hasVotingPowerTransactionInProgress || $selectedAccount?.hasVotingTransactionInProgress

    function onCancelClick(): void {
        closePopup()
    }

    async function onStopVotingClick(): Promise<void> {
        try {
            await checkActiveProfileAuthAsync()
        } catch (error) {
            return
        }

        await stopVotingForProposal($selectedProposal?.id)
        closePopup()
    }
</script>

<PopupTemplate
    title={localize('popups.stopVoting.title')}
    description={localize('popups.stopVoting.body', { values: { proposalName: $selectedProposal?.title } })}
    backButton={{
        onClick: onCancelClick,
        text: localize('actions.cancel'),
    }}
    continueButton={{
        onClick: onStopVotingClick,
        text: localize('actions.stopVoting'),
    }}
    busy={hasGovernanceTransactionInProgress}
>
    <Alert variant="info" text={localize('popups.stopVoting.hint')} />
</PopupTemplate>

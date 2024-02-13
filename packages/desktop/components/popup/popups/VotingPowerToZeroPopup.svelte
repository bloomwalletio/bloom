<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { setVotingPower } from '@contexts/governance/actions'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuthAsync } from '@core/profile/actions'
    import { PopupId, closePopup, openPopup, popupState } from '@desktop/auxiliary/popup'
    import { PopupTemplate } from '@components/popup'

    const ZERO_VOTING_POWER = BigInt(0)

    $: isTransferring =
        $selectedAccount?.hasVotingPowerTransactionInProgress || $selectedAccount?.hasVotingTransactionInProgress

    function onCancelClick(): void {
        closePopup()
    }

    async function onSubmit(): Promise<void> {
        try {
            await checkActiveProfileAuthAsync()
        } catch {
            return
        }

        // After unlocking stronghold popup, the popup tracks newVotingPower to show it when reopened.
        $popupState.props = { newVotingPower: ZERO_VOTING_POWER }

        openPopup({
            id: PopupId.ManageVotingPower,
            props: { newVotingPower: ZERO_VOTING_POWER },
        })

        try {
            await setVotingPower(ZERO_VOTING_POWER)
        } catch (err) {
            handleError(err)
        }
    }
</script>

<PopupTemplate
    title={localize('popups.manageVotingPower.title')}
    description={localize('popups.manageVotingPower.body')}
    backButton={{ text: localize('actions.cancel'), onClick: onCancelClick }}
    continueButton={{
        type: 'submit',
        text: localize('actions.confirm'),
        form: 'manage-voting-power',
    }}
    busy={isTransferring}
>
    <form id="manage-voting-power" class="space-y-4" on:submit|preventDefault={onSubmit}>
        <Alert variant="warning" text={localize('popups.manageVotingPower.amountZero')} />
    </form>
</PopupTemplate>

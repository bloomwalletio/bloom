<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { stopVotingForProposal } from '@contexts/governance/actions'
    import { selectedProposal } from '@contexts/governance/stores'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { Text, TextType } from '@ui'
    import { Button } from '@bloomwalletio/ui'

    $: hasGovernanceTransactionInProgress =
        $selectedAccount?.hasVotingPowerTransactionInProgress || $selectedAccount?.hasVotingTransactionInProgress

    function onCancelClick(): void {
        closePopup()
    }

    async function onStopVotingClick(): Promise<void> {
        await checkActiveProfileAuth(async () => {
            await stopVotingForProposal($selectedProposal?.id)
            closePopup()
        })
    }
</script>

<stop-voting>
    <Text type={TextType.h3}>{localize('popups.stopVoting.title')}</Text>
    <div class="flex flex-col w-full space-y-5 mt-6">
        <Text fontSize="15"
            >{localize('popups.stopVoting.body', { values: { proposalName: $selectedProposal?.title } })}</Text
        >
        <Alert variant="info" text={localize('popups.stopVoting.hint')} />
    </div>
    <div class="flex w-full space-x-4 mt-6">
        <Button
            variant="outlined"
            width="full"
            disabled={hasGovernanceTransactionInProgress}
            on:click={onCancelClick}
            text={localize('actions.cancel')}
        />
        <Button
            width="full"
            on:click={onStopVotingClick}
            disabled={hasGovernanceTransactionInProgress}
            busy={hasGovernanceTransactionInProgress}
            text={localize('actions.stopVoting')}
        />
    </div>
</stop-voting>

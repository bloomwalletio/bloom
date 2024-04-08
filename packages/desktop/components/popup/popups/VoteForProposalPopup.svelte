<script lang="ts">
    import { Alert, Table } from '@bloomwalletio/ui'
    import { vote } from '@contexts/governance/actions'
    import { ABSTAIN_VOTE_VALUE } from '@contexts/governance/constants'
    import { selectedProposal } from '@contexts/governance/stores'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth, getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let selectedAnswerValues: number[]

    $: formattedVotingPower = formatTokenAmountBestMatch($selectedAccount?.votingPower, getBaseToken())
    $: hasVotingPower = $selectedAccount?.votingPower > 0

    $: hasGovernanceTransactionInProgress =
        $selectedAccount?.hasVotingPowerTransactionInProgress || $selectedAccount?.hasVotingTransactionInProgress

    $: numberOfAbstainedQuestions =
        selectedAnswerValues?.filter((answerValue) => answerValue === ABSTAIN_VOTE_VALUE).length ?? 0

    async function onSubmit(): Promise<void> {
        if (hasVotingPower) {
            try {
                await checkActiveProfileAuth()
            } catch {
                return
            }

            await vote($selectedProposal?.id, selectedAnswerValues)
            closePopup()
        } else {
            openPopup({ id: PopupId.ManageVotingPower })
        }
    }

    function onCancelClick(): void {
        closePopup()
    }
</script>

<PopupTemplate
    title={localize('popups.voteForProposal.title')}
    description={localize('popups.voteForProposal.body', {
        values: {
            proposal: $selectedProposal?.title,
        },
    })}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
        disabled: hasGovernanceTransactionInProgress,
    }}
    continueButton={{
        text: hasVotingPower ? localize('actions.vote') : localize('views.governance.votingPower.manage'),
        form: 'vote-proposal',
        type: 'submit',
    }}
    busy={hasGovernanceTransactionInProgress}
>
    <form
        id="vote-proposal"
        on:submit|preventDefault={onSubmit}
        class="w-full h-full space-y-4 flex flex-auto flex-col shrink-0"
    >
        <Table items={[{ key: localize('popups.voteForProposal.key'), value: formattedVotingPower }]} />
        {#if !hasVotingPower}
            <Alert variant="danger" text={localize('popups.voteForProposal.noVotingPower')} />
        {:else if numberOfAbstainedQuestions > 0}
            <Alert
                variant="warning"
                text={localize('popups.voteForProposal.hasAbstained', {
                    values: { numberOfQuestions: numberOfAbstainedQuestions },
                })}
            />
        {/if}
    </form>
</PopupTemplate>

<script lang="ts">
    import { Alert, Button, Table } from '@bloomwalletio/ui'
    import { vote } from '@contexts/governance/actions'
    import { ABSTAIN_VOTE_VALUE } from '@contexts/governance/constants'
    import { selectedProposal } from '@contexts/governance/stores'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth, getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/token'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { FontWeight, Text, TextType } from '@ui'

    export let selectedAnswerValues: number[]

    $: formattedVotingPower = formatTokenAmountBestMatch(Number($selectedAccount?.votingPower), getBaseToken())
    $: hasVotingPower = Number($selectedAccount?.votingPower) > 0

    $: hasGovernanceTransactionInProgress =
        $selectedAccount?.hasVotingPowerTransactionInProgress || $selectedAccount?.hasVotingTransactionInProgress

    $: numberOfAbstainedQuestions =
        selectedAnswerValues?.filter((answerValue) => answerValue === ABSTAIN_VOTE_VALUE).length ?? 0

    async function onSubmit(): Promise<void> {
        if (hasVotingPower) {
            await checkActiveProfileAuth(async () => {
                await vote($selectedProposal?.id, selectedAnswerValues)
                closePopup()
            })
        } else {
            openPopup({ id: PopupId.ManageVotingPower })
        }
    }
</script>

<form
    id="vote-proposal"
    on:submit|preventDefault={onSubmit}
    class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0"
>
    <Text type={TextType.h4} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.voteForProposal.title')}
    </Text>
    <Text fontSize="14" classes="text-left break-words">
        {localize('popups.voteForProposal.body', {
            values: {
                proposal: $selectedProposal?.title,
            },
        })}
    </Text>
    <div class="space-y-5">
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
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button
            width="full"
            disabled={hasGovernanceTransactionInProgress}
            variant="outlined"
            on:click={() => closePopup()}
            text={localize('actions.cancel')}
        />
        <Button
            type="submit"
            width="full"
            disabled={hasGovernanceTransactionInProgress}
            busy={hasGovernanceTransactionInProgress}
            text={hasVotingPower ? localize('actions.vote') : localize('views.governance.votingPower.manage')}
        />
    </popup-buttons>
</form>

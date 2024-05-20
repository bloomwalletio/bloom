<script lang="ts">
    import {
        EventStatus,
        ParticipationEventType,
        VotingEventPayload,
        TrackedParticipationOverview,
    } from '@iota/sdk/out/types'
    import { Alert, Button } from '@bloomwalletio/ui'
    import { getVotingEvent } from '@contexts/governance/actions'
    import { ABSTAIN_VOTE_VALUE } from '@contexts/governance/constants'
    import {
        participationOverviewForSelectedAccount,
        selectedParticipationEventStatus,
        selectedProposal,
    } from '@contexts/governance/stores'
    import {
        getActiveParticipation,
        getProposalStatusForMilestone,
        isProposalVotable,
        isVotingForSelectedProposal,
    } from '@contexts/governance/utils'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { getStardustNetwork } from '@core/network/stores'
    import { getBestTimeDuration, milestoneToDate } from '@core/utils'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { ProposalQuestion } from '../../components'
    import { onMount } from 'svelte'
    import { ProjectionTogglePane } from '.'

    export let statusLoaded: boolean = false
    export let overviewLoaded: boolean = false
    export let projected: boolean = false

    let selectedAnswerValues: number[] = []
    let votedAnswerValues: number[] = []
    let votingPayload: VotingEventPayload
    let hasMounted = false
    let alertText = ''
    let proposalQuestions: HTMLElement
    let isVotingForProposal: boolean = false
    let openedQuestionIndex: number = -1
    let isUpdatingVotedAnswerValues: boolean = false
    let lastAction: 'vote' | 'stopVote'
    const currentMilestone = getStardustNetwork().currentMilestone

    $: selectedProposalOverview = $participationOverviewForSelectedAccount?.participations?.[$selectedProposal?.id]
    $: trackedParticipations = Object.values(selectedProposalOverview ?? {})

    // Reactively start updating votes once component has mounted and participation overview is available.
    $: hasMounted &&
        $selectedParticipationEventStatus &&
        trackedParticipations &&
        $currentMilestone &&
        setVotedAnswerValues()
    $: hasMounted && selectedProposalOverview && updateIsVoting()

    $: questions = votingPayload?.questions

    $: if (questions?.length > 0 && selectedAnswerValues?.length === 0) {
        selectedAnswerValues = [
            ...(getActiveParticipation($selectedProposal?.id)?.answers ?? Array.from({ length: questions?.length })),
        ]
    }

    $: $selectedParticipationEventStatus, (alertText = getAlertText())

    $: hasGovernanceTransactionInProgress =
        $selectedAccount?.hasVotingPowerTransactionInProgress || $selectedAccount?.hasVotingTransactionInProgress

    $: areSelectedAndVotedAnswersEqual = JSON.stringify(selectedAnswerValues) === JSON.stringify(votedAnswerValues)

    $: {
        if (hasGovernanceTransactionInProgress) {
            isUpdatingVotedAnswerValues = true
        }

        const hasVoted = lastAction === 'vote' && areSelectedAndVotedAnswersEqual
        const hasStoppedVoting = lastAction === 'stopVote' && !areSelectedAndVotedAnswersEqual
        if (hasVoted || hasStoppedVoting) {
            isUpdatingVotedAnswerValues = Boolean(hasGovernanceTransactionInProgress)
        }
    }

    $: status = getProposalStatusForMilestone($currentMilestone, $selectedProposal?.milestones)
    $: isVotable = [EventStatus.Commencing, EventStatus.Holding].includes(status)

    function hasSelectedNoAnswers(_selectedAnswerValues: number[]): boolean {
        return (
            _selectedAnswerValues.length === 0 ||
            _selectedAnswerValues.every((answerValue) => answerValue === undefined)
        )
    }

    async function setVotingEventPayload(eventId: string): Promise<void> {
        try {
            const event = await getVotingEvent(eventId)
            if (!event) {
                throw new Error('Event not found')
            }

            if (event.data?.payload?.type === ParticipationEventType.Voting) {
                votingPayload = event.data.payload
            } else {
                throw new Error('Event is a staking event')
            }
        } catch (err) {
            handleError(err)
        }
    }

    function updateIsVoting(): void {
        isVotingForProposal = isVotingForSelectedProposal()
    }

    function setVotedAnswerValues(): void {
        let lastActiveOverview: TrackedParticipationOverview | undefined
        switch ($selectedParticipationEventStatus?.status) {
            case EventStatus.Commencing:
                lastActiveOverview = trackedParticipations?.find((overview) => overview.endMilestoneIndex === 0)
                break
            case EventStatus.Holding:
                lastActiveOverview = trackedParticipations?.find((overview) => overview.endMilestoneIndex === 0)
                break
            case EventStatus.Ended:
                lastActiveOverview = trackedParticipations?.find(
                    (overview) => overview.endMilestoneIndex > $selectedProposal.milestones.ended
                )
                break
        }
        votedAnswerValues = lastActiveOverview?.answers ?? []
    }

    function onQuestionClick(questionIndex: number): void {
        openedQuestionIndex = questionIndex === openedQuestionIndex ? 0 : questionIndex
    }

    function onStopVotingClick(): void {
        lastAction = 'stopVote'
        openPopup({
            id: PopupId.StopVoting,
        })
    }

    function onVoteClick(): void {
        lastAction = 'vote'
        const chosenAnswerValues = selectedAnswerValues.map((answerValue) =>
            answerValue === undefined ? ABSTAIN_VOTE_VALUE : answerValue
        )
        openPopup({
            id: PopupId.VoteForProposal,
            props: { selectedAnswerValues: chosenAnswerValues },
        })
    }

    function onAnswerClick(answerValue: number, questionIndex: number): void {
        selectedAnswerValues[questionIndex] = answerValue

        openedQuestionIndex = questionIndex + 1

        const selectedQuestionElement: HTMLElement | null = proposalQuestions?.querySelector(
            `proposal-question:nth-child(${openedQuestionIndex})`
        )
        setTimeout(() => {
            proposalQuestions.scrollTo({ top: selectedQuestionElement?.offsetTop, behavior: 'smooth' })
        }, 250)
    }

    function getAlertText(): string {
        if (!$selectedProposal) {
            return ''
        }

        const millis =
            milestoneToDate($currentMilestone, $selectedProposal.milestones[EventStatus.Commencing]).getTime() -
            new Date().getTime()
        const timeString = getBestTimeDuration(millis, 'second')
        return localize('views.governance.details.hintVote', { values: { time: timeString } })
    }

    onMount(async () => {
        await setVotingEventPayload($selectedProposal?.id)
        openedQuestionIndex = votingPayload?.questions.length > 1 ? -1 : 0
        hasMounted = true
    })
</script>

<div class="w-3/5 h-full p-6 pr-3 flex flex-col justify-between gap-4">
    {#if [EventStatus.Commencing, EventStatus.Holding].includes(status)}
        <div class="pr-5">
            <ProjectionTogglePane bind:checked={projected} />
        </div>
    {/if}
    <proposal-questions
        class="relative flex flex-1 flex-col space-y-5 overflow-y-scroll pr-3"
        bind:this={proposalQuestions}
    >
        {#if questions}
            {#each questions as question, questionIndex}
                <ProposalQuestion
                    {question}
                    {questionIndex}
                    isOpened={openedQuestionIndex === questionIndex}
                    isLoading={!overviewLoaded || !statusLoaded}
                    selectedAnswerValue={selectedAnswerValues[questionIndex]}
                    votedAnswerValue={votedAnswerValues[questionIndex]}
                    answerStatuses={$selectedParticipationEventStatus?.questions?.[questionIndex]?.answers}
                    {onQuestionClick}
                    {onAnswerClick}
                    {projected}
                />
            {/each}
        {/if}
    </proposal-questions>
    {#if status === EventStatus.Upcoming}
        <Alert variant="info" text={alertText} />
    {:else if isVotable}
        {@const isLoaded = questions && overviewLoaded && statusLoaded}
        {@const isStoppingVote = lastAction === 'stopVote' && hasGovernanceTransactionInProgress}
        {@const isStopVotingDisabled = !isLoaded || !isVotingForProposal || isUpdatingVotedAnswerValues}
        {@const isVoting = lastAction === 'vote' && hasGovernanceTransactionInProgress}
        {@const isVotingDisabled =
            !isLoaded ||
            !isProposalVotable(status) ||
            hasSelectedNoAnswers(selectedAnswerValues) ||
            isUpdatingVotedAnswerValues ||
            areSelectedAndVotedAnswersEqual}
        <buttons-container class="flex w-full space-x-4 mt-6">
            <Button
                variant="outlined"
                width="full"
                on:click={onStopVotingClick}
                disabled={isStopVotingDisabled}
                busy={isStoppingVote}
                text={localize('actions.stopVoting')}
            />
            <Button
                width="full"
                on:click={onVoteClick}
                disabled={isVotingDisabled}
                busy={isVoting}
                text={localize('actions.vote')}
            />
        </buttons-container>
    {/if}
</div>

<script lang="ts">
    import { AnswerStatus, EventStatus, Question } from '@iota/sdk/out/types'

    import { ProposalAnswer } from './'
    import { Icon, IconName, Text, IconButton } from '@bloomwalletio/ui'

    import { ABSTAIN_VOTE_VALUE } from '@contexts/governance/constants'
    import {
        getPercentagesFromAnswerStatuses,
        getProposalStatusForMilestone,
        IProposalAnswerPercentages,
    } from '@contexts/governance'
    import { selectedProposal } from '@contexts/governance/stores'
    import { openPopup } from '@desktop/auxiliary/popup/actions'
    import { PopupId } from '@desktop/auxiliary/popup'
    import { localize } from '@core/i18n'
    import { getStardustNetwork } from '@core/network/stores'

    export let onQuestionClick: (questionIndex: number) => void
    export let onAnswerClick: (answerValue: number, questionIndex: number) => void

    export let answerStatuses: AnswerStatus[] = []
    export let questionIndex: number = undefined
    export let isOpened = false
    export let question: Question
    export let selectedAnswerValue: number = undefined
    export let votedAnswerValue: number = undefined
    export let isLoading: boolean = false
    export let projected: boolean = false

    let percentages: IProposalAnswerPercentages = {}
    let winnerAnswerIndex: number

    const { currentMilestone } = getStardustNetwork()
    $: status = getProposalStatusForMilestone($currentMilestone, $selectedProposal?.milestones)

    $: answers = [...(question?.answers ?? []), { value: 0, text: 'Abstain', additionalInfo: '' }]

    $: percentages = getPercentagesFromAnswerStatuses(answerStatuses)
    $: disabled = status === EventStatus.Upcoming || status === EventStatus.Ended || !!$selectedProposal?.error
    $: answerStatuses, setWinnerAnswerIndex()
    $: showMargin =
        isOpened ||
        ((votedAnswerValue || votedAnswerValue === ABSTAIN_VOTE_VALUE) && !isOpened) ||
        ((selectedAnswerValue || selectedAnswerValue === ABSTAIN_VOTE_VALUE) && !isOpened) ||
        winnerAnswerIndex !== undefined

    function setWinnerAnswerIndex(): void {
        if (status === EventStatus.Ended && answerStatuses?.length > 0) {
            const answersAccumulated = answerStatuses?.map((answer) => answer.accumulated)
            const maxAccumulated = Math.max(...answersAccumulated)
            winnerAnswerIndex = answersAccumulated?.indexOf(maxAccumulated)
        }
    }

    function onInfoClick(): void {
        openPopup({
            id: PopupId.MarkdownBlock,
            props: {
                title: question.text,
                markdown: question.additionalInfo,
            },
        })
    }
</script>

<proposal-question
    class="flex flex-col px-5 py-4 rounded-xl border border-solid border-stroke
    cursor-pointer dark:border-stroke-dark dark:bg-surface-dark"
    class:animate-pulse={isLoading}
>
    <button on:click={() => onQuestionClick(questionIndex)} class="flex justify-between items-center">
        <div class="flex flex-col min-w-0 gap-1">
            <div class="flex flex-row gap-2">
                {#if questionIndex !== undefined}
                    <Text align="left">{localize('general.question')} {questionIndex + 1}</Text>
                {/if}
                {#if question.additionalInfo}
                    <IconButton icon={IconName.InfoCircle} size="xs" on:click={onInfoClick} />
                {/if}
            </div>
            <div class="flex flex-row space-x-1.5 items-center">
                <Text align="left" fontWeight="medium" textColor="secondary" truncate={!isOpened}>
                    {question.text}
                </Text>
            </div>
        </div>
        <div class="transform {isOpened ? 'rotate-180' : 'rotate-0'}">
            <Icon name={IconName.ChevronDown} textColor="secondary" />
        </div>
    </button>
    <proposal-answers class:mt-4={showMargin} class="flex flex-col gap-2">
        {#each answers as answer, answerIndex}
            <ProposalAnswer
                {answer}
                {answerIndex}
                {votedAnswerValue}
                {selectedAnswerValue}
                {disabled}
                {isLoading}
                {projected}
                hidden={!isOpened}
                percentage={percentages[answer.value]}
                isWinner={answerIndex === winnerAnswerIndex}
                truncate={!isOpened}
                onAnswerClick={() => onAnswerClick(answer.value, questionIndex)}
            />
        {/each}
    </proposal-answers>
</proposal-question>

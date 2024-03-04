<script lang="ts">
    import { AnswerStatus, EventStatus, Question } from '@iota/sdk/out/types'

    import { ProposalAnswer } from './'
    import { Icon, IconName, Text, TooltipIcon } from '@bloomwalletio/ui'

    import { ABSTAIN_VOTE_VALUE } from '@contexts/governance/constants'
    import {
        getPercentagesFromAnswerStatuses,
        getProjectedPercentages,
        IProposalAnswerPercentages,
    } from '@contexts/governance'
    import { selectedProposal } from '@contexts/governance/stores'

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

    $: answers = [...(question?.answers ?? []), { value: 0, text: 'Abstain', additionalInfo: '' }]
    $: percentages = projected
        ? getProjectedPercentages(answerStatuses)
        : getPercentagesFromAnswerStatuses(answerStatuses)
    $: disabled =
        $selectedProposal?.status === EventStatus.Upcoming ||
        $selectedProposal?.status === EventStatus.Ended ||
        !!$selectedProposal?.error
    $: answerStatuses, setWinnerAnswerIndex()
    $: showMargin =
        isOpened ||
        ((votedAnswerValue || votedAnswerValue === ABSTAIN_VOTE_VALUE) && !isOpened) ||
        ((selectedAnswerValue || selectedAnswerValue === ABSTAIN_VOTE_VALUE) && !isOpened) ||
        winnerAnswerIndex !== undefined

    function setWinnerAnswerIndex(): void {
        if ($selectedProposal?.status === EventStatus.Ended && answerStatuses?.length > 0) {
            const answersAccumulated = answerStatuses?.map((answer) => answer.accumulated)
            const maxAccumulated = Math.max(...answersAccumulated)
            winnerAnswerIndex = answersAccumulated?.indexOf(maxAccumulated)
        }
    }
</script>

<proposal-question
    class="flex flex-col px-5 py-4 rounded-xl border border-solid border-stroke
    cursor-pointer dark:border-stroke-dark dark:bg-surface-dark"
    class:animate-pulse={isLoading}
>
    <button on:click={() => onQuestionClick(questionIndex)} class="flex justify-between items-center">
        <div class="flex flex-col min-w-0 gap-1">
            {#if questionIndex !== undefined}
                <Text align="left">Question {questionIndex + 1}</Text>
            {/if}
            <div class="flex flex-row space-x-1.5 items-center">
                <Text align="left" fontWeight="medium" textColor="secondary" truncate={!isOpened}>
                    {question.text}
                </Text>
                {#if question.additionalInfo}
                    <TooltipIcon tooltip={question.additionalInfo} placement="bottom" size="xxs" />
                {/if}
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
                hidden={!isOpened}
                percentage={percentages[answer.value]}
                isWinner={answerIndex === winnerAnswerIndex}
                truncate={!isOpened}
                onAnswerClick={() => onAnswerClick(answer.value, questionIndex)}
            />
        {/each}
    </proposal-answers>
</proposal-question>

<script lang="ts">
    import { Answer } from '@iota/sdk/out/types'
    import { Icon, IconName, Text, TooltipIcon } from '@bloomwalletio/ui'

    export let onAnswerClick: () => void

    export let answer: Answer
    export let answerIndex: number = undefined
    export let votedAnswerValue: number = undefined
    export let selectedAnswerValue: number = undefined
    export let percentage: string = ''
    export let disabled = false
    export let hidden: boolean = null
    export let isWinner: boolean
    export let truncate = false
    export let isLoading = false

    let isSelected: boolean
    let isVotedFor: boolean

    $: selectedAnswerValue, votedAnswerValue, setIsSelected()
    $: isVotedFor = votedAnswerValue === answer?.value

    function onClick(): void {
        if (!disabled && !hidden && !isLoading) {
            onAnswerClick()
        }
    }

    function setIsSelected(): void {
        if (selectedAnswerValue === answer?.value) {
            isSelected = true
        } else if (selectedAnswerValue === undefined && votedAnswerValue === answer?.value) {
            isSelected = true
        } else {
            isSelected = false
        }
    }
</script>

<button
    type="button"
    class="proposal-answer"
    class:disabled
    class:hidden={isSelected || isWinner ? false : hidden}
    class:voted={isVotedFor}
    class:winner={isWinner}
    class:selected={isSelected}
    class:cursor-default={isLoading}
    style:--percentage={percentage}
    on:click={onClick}
>
    <div class="flex space-x-3 items-center w-full min-w-0">
        {#if answerIndex !== undefined}
            <answer-index>{answerIndex + 1}</answer-index>
        {/if}
        <Text
            align="left"
            fontWeight={isSelected || isVotedFor ? 'semibold' : 'medium'}
            textColor={isSelected || isVotedFor ? 'primary' : 'secondary'}
            {truncate}
            >{answer.text}
        </Text>
    </div>
    <div class="flex items-center space-x-1.5">
        {#if isVotedFor}
            <Icon name={IconName.ReceiptCheck} textColor="brand" size="xs" />
        {/if}
        {#if isWinner}
            <Icon name={IconName.Trophy} size="xs" />
        {/if}
        {#if percentage}
            <Text type="sm" textColor="secondary">{percentage}</Text>
        {/if}
        {#if answer.additionalInfo}
            <div class="w-3 h-3">
                <TooltipIcon tooltip={answer.additionalInfo} placement="left" size="xxs" />
            </div>
        {/if}
    </div>
</button>

<style lang="scss">
    .proposal-answer {
        @apply rounded-lg border border-solid border-stroke dark:border-stroke-dark;
        @apply relative hidden items-center justify-between p-3 overflow-hidden;
        > * {
            z-index: 2;
        }

        &::after {
            @apply z-10 absolute inline-block h-full -ml-3 mr-auto;
            @apply rounded-l-md bg-surface-2;
            content: '';
            width: var(--percentage);
            z-index: 1;
        }

        &:not(.disabled):hover {
            @apply border-brand;
        }

        &:not(.hidden) {
            @apply flex;
        }

        &.selected {
            @apply border-brand;

            answer-index {
                @apply bg-brand text-white;
            }
        }

        &.winner {
            @apply bg-text-brand-dark border-brand;

            &::after {
                @apply bg-brand;
            }

            answer-index {
                @apply bg-surface-brand text-white;
            }

            :global(*) {
                @apply text-white;
            }
        }

        &:not(.selected):not(.winner) {
            @apply dark:border-stroke-dark;
        }

        &:not(.winner) {
            @apply dark:bg-surface-dark;

            &::after {
                @apply dark:bg-surface-dark;
            }

            answer-index {
                @apply dark:bg-surface-dark dark:border-stroke-dark;
            }
        }

        &.disabled {
            @apply cursor-default;
        }

        answer-index {
            @apply flex shrink-0 items-center justify-center h-5 w-5 bg-white;
            @apply border border-solid border-stroke rounded-sm;
            @apply font-bold text-12 text-gray-500;
        }
    }
</style>

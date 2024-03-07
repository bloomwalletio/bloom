<script lang="ts">
    import { Answer } from '@iota/sdk/out/types'
    import { Icon, IconButton, IconName, Text } from '@bloomwalletio/ui'
    import { IProposalAnswerPercentage } from '@contexts/governance'
    import { darkMode } from '@core/app/stores'
    import { openPopup, PopupId } from '@desktop/auxiliary/popup'

    export let onAnswerClick: () => void

    export let answer: Answer
    export let answerIndex: number = undefined
    export let votedAnswerValue: number = undefined
    export let selectedAnswerValue: number = undefined
    export let percentage: IProposalAnswerPercentage | undefined = undefined
    export let disabled = false
    export let hidden: boolean = null
    export let isWinner: boolean
    export let truncate = false
    export let isLoading = false
    export let projected: boolean = false

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

    function onInfoClick(): void {
        openPopup({
            id: PopupId.MarkdownBlock,
            props: {
                title: answer.text,
                markdown: answer.additionalInfo,
            },
        })
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
    class:dark={$darkMode}
    style:--accumulated-percentage={percentage?.accumulated}
    style:--projected-percentage={projected ? percentage?.projected : '0%'}
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
        {#if answer.additionalInfo}
            <IconButton icon={IconName.InfoCircle} size="xs" on:click={onInfoClick} />
        {/if}
    </div>
    <div class="flex items-center space-x-1.5">
        {#if isVotedFor}
            <Icon name={IconName.ReceiptCheck} textColor="brand" size="xs" />
        {/if}
        {#if isWinner}
            <Icon name={IconName.Trophy} size="xs" />
        {/if}
        {#if percentage?.accumulated}
            <Text type="sm" textColor="secondary">{percentage?.accumulated}</Text>
        {/if}
    </div>
</button>

<style lang="scss">
    .proposal-answer {
        @apply rounded-lg border border-solid border-stroke dark:border-stroke-dark;
        @apply relative hidden items-center justify-between p-[0.5625rem] overflow-hidden;
        > * {
            z-index: 2;
        }

        &::after {
            @apply absolute inline-block h-full -ml-3 mr-auto;
            @apply rounded-l-md bg-surface-2;
            content: '';
            width: var(--accumulated-percentage);
            z-index: 1;
        }

        &::before {
            @apply absolute inline-block h-full -ml-3 mr-auto rounded-l-md;
            opacity: 0.05;
            content: '';
            width: var(--projected-percentage);
            z-index: 2;
            background: repeating-linear-gradient(-45deg, white, white 2px, transparent 2px, transparent 7px);
        }

        &:not(.winner):not(.dark)::before {
            background: repeating-linear-gradient(-45deg, black, black 2px, transparent 2px, transparent 7px);
        }

        &:not(.disabled):hover {
            @apply border-brand;
        }

        &:not(.hidden) {
            @apply flex;
        }

        &.selected {
            @apply border-brand dark:border-brand;

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

        &:not(.winner) {
            @apply dark:bg-surface-dark;

            &::after {
                @apply dark:bg-surface-2-dark;
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

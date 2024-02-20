<script lang="ts">
    import { Answer, EventStatus } from '@iota/sdk/out/types'

    import { Icon } from '@ui'

    import { darkMode } from '@core/app/stores'

    import { Icon as IconEnum } from '@auxiliary/icon'
    import { Indicator, Text, TooltipIcon } from '@bloomwalletio/ui'

    export let onAnswerClick: () => void

    export let answer: Answer
    export let answerIndex: number = undefined
    export let votedAnswerValue: number = undefined
    export let selectedAnswerValue: number = undefined
    export let percentage: string = ''
    // export let disabled = false
    const disabled = false
    export let hidden: boolean = null
    export let isWinner: boolean
    export let proposalStatus: EventStatus
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
    class:dark={$darkMode}
    class:disabled
    class:hidden={isSelected || isWinner ? false : hidden}
    class:voted={isVotedFor}
    class:winner={isWinner}
    class:selected={isSelected}
    class:cursor-default={isLoading}
    style:--percentage={'83%' || percentage}
    on:click={onClick}
>
    <div class="flex space-x-3 items-center w-full min-w-0">
        {#if answerIndex !== undefined}
            {#if isVotedFor}
                <status-icon class="flex justify-center items-center w-5 h-5">
                    {#if proposalStatus === EventStatus.Ended}
                        <Icon icon={IconEnum.Voted} width={20} height={20} />
                    {:else if proposalStatus === EventStatus.Commencing}
                        <Icon icon={IconEnum.History} width={20} height={20} />
                    {:else if proposalStatus === EventStatus.Holding}
                        <Indicator size="sm" ping />
                    {/if}
                </status-icon>
            {:else}
                <answer-index>{answerIndex + 1}</answer-index>
            {/if}
        {/if}
        <Text
            fontWeight={isSelected || isVotedFor ? 'semibold' : 'medium'}
            textColor={isSelected || isVotedFor ? 'primary' : 'secondary'}
            truncate>{answer.text}</Text
        >
    </div>
    <div class="flex items-center space-x-1.5">
        {#if isWinner}
            <Icon icon={IconEnum.Trophy} />
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

        &:not(.winner) status-icon :global(svg) {
            @apply text-blue-500;
        }

        &.selected {
            @apply border-brand;

            answer-index {
                @apply bg-brand text-white;
            }
        }

        &.voted {
            &:hover {
                @apply bg-blue-50;
            }

            &::after {
                @apply bg-blue-100;
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

        &.dark:not(.selected):not(.winner) {
            @apply border-transparent;
        }

        &.dark:not(.winner) {
            @apply bg-gray-900;

            &::after {
                @apply bg-gray-950;
            }

            answer-index {
                @apply bg-gray-900 border-gray-800;
            }
        }

        &.disabled {
            @apply cursor-default;
        }

        answer-index {
            @apply flex items-center justify-center h-5 w-5 bg-white;
            @apply border border-solid border-stroke rounded-sm;
            @apply font-bold text-12 text-gray-500;
        }
    }
</style>

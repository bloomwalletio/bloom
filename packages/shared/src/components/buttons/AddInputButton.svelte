<script lang="ts">
    import { Icon, IconName, Text } from '@bloomwalletio/ui'

    export let buttonElement: HTMLButtonElement | undefined = undefined
    export let text: string
    export let open = false
    export let disabled = false
    export let onClick: () => void
    export let onMouseEnter: () => void = () => {}
    export let onMouseLeave: () => void = () => {}
</script>

{#if !open}
    <button
        bind:this={buttonElement}
        class="closable-button"
        class:disabled
        {disabled}
        on:click={onClick}
        on:mouseenter={onMouseEnter}
        on:mouseleave={onMouseLeave}
    >
        <div class="flex flex-row items-center space-x-2">
            <Icon name={IconName.Plus} textColor="secondary" size="xxs" />
            <Text type="base" textColor="secondary">{text}</Text>
        </div>
    </button>
{/if}

<style lang="postcss">
    .closable-button {
        @apply w-max py-1.5 px-3 rounded-md;
        @apply bg-surface-2 dark:bg-surface-2-dark hover:bg-surface-1 focus:bg-surface-1 dark:hover:bg-surface-1-dark dark:focus:bg-surface-1-dark;

        &.disabled {
            @apply bg-opacity-10 cursor-default;
        }
    }
</style>

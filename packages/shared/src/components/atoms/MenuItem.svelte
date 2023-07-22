<script lang="ts">
    import { Icon, Text, Spinner, Position, InformationTooltip } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let icon: string = ''
    export let iconProps: Record<string, unknown> = {}
    export let title: string
    export let subtitle = ''
    export let onClick: () => any
    export let selected = false
    export let disabled = false
    export let isLoading = false
    export let enableTooltipVisible = false
    export let tooltip: string = ''

    export let variant: 'success' | 'error' | 'warning' | 'info' = 'info'

    let showTooltip = false
    let menuItem: HTMLElement

    $: isDisabled = disabled || isLoading

    function onMenuItemClick(): () => void {
        if (!disabled && onClick) {
            return onClick()
        }
    }

    function toggleTooltip(show: boolean): void {
        showTooltip = enableTooltipVisible && show
    }
</script>

<button
    bind:this={menuItem}
    on:click|stopPropagation={onMenuItemClick}
    on:mouseenter={() => toggleTooltip(true)}
    on:mouseleave={() => toggleTooltip(false)}
    class="group {variant}"
    {disabled}
>
    <div class="flex flex-row space-x-3 items-center">
        {#if isLoading}
            <Spinner busy width={24} height={24} />
        {:else}
            <icon-container class:disabled={isDisabled} class={variant}>
                <Icon {icon} height={24} width={24} {...iconProps} />
            </icon-container>
        {/if}
        <div class="flex flex-col text-left">
            <text-container class:disabled={isDisabled} class={variant}>
                <Text color={isDisabled ? 'gray-400' : 'gray-800'} darkColor={isDisabled ? 'gray-700' : 'white'}>
                    {title}
                </Text>
            </text-container>
            {#if subtitle}
                <Text color={isDisabled ? 'gray-400' : 'gray-600'} darkColor={isDisabled ? 'gray-700' : 'gray-500'}>
                    {subtitle}
                </Text>
            {/if}
        </div>
    </div>
    {#if selected}
        <Icon icon={IconEnum.Checkmark} classes="ml-2 text-blue-500" />
    {/if}
</button>

{#if showTooltip}
    <InformationTooltip anchor={menuItem} position={Position.Right} body={tooltip} />
{/if}

<style lang="scss">
    $variants: info 'blue', success 'green', warning 'yellow', error 'red';

    button {
        @apply w-full flex flex-row justify-between items-center p-3;

        &:disabled {
            @apply bg-gray-100 dark:bg-gray-900 cursor-default;
        }

        &:not(:disabled) {
            @apply dark:hover:bg-gray-800 dark:hover:bg-opacity-20;

            @each $variant, $color in $variants {
                &.#{$variant} {
                    @apply hover:bg-#{$color}-50 hover:bg-#{$color}-800 dark:hover:bg-opacity-20;
                }
            }
        }
    }

    icon-container {
        @apply text-gray-600;

        &.disabled {
            @apply text-gray-400 dark:text-gray-700;
        }

        &:not(.disabled),
        text-container {
            @each $variant, $color in $variants {
                &.#{$variant} {
                    @apply group-hover:text-#{$color}-500;
                }
            }
        }
    }
</style>

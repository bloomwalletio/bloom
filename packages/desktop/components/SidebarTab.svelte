<script lang="ts">
    import { Icon, IconName, Indicator, Text, Tooltip } from '@bloomwalletio/ui'
    import { IDashboardSidebarTab, ISettingsSidebarTab } from '@desktop/routers'

    export let tab: IDashboardSidebarTab | ISettingsSidebarTab = undefined
    export let selected: boolean = false
    export let expanded: boolean = true
    export let disabled: boolean = false
    export let tooltip: string = ''

    let hover = false
    let buttonElement: HTMLButtonElement

    function onClick(): void {
        tab?.onClick()
    }
</script>

<button
    bind:this={buttonElement}
    class:selected
    on:click={onClick}
    on:mouseenter={() => (hover = true)}
    on:mouseleave={() => (hover = false)}
    {disabled}
>
    <div class="flex flex-row items-center relative space-x-4">
        <Icon name={tab?.icon} textColor={disabled ? 'secondary' : selected ? 'brand' : 'primary'} />
        {#if tab?.notificationType}
            <Indicator
                size="sm"
                color={tab?.notificationType === 'warning' ? 'yellow' : 'red'}
                ping
                class="absolute top-0 right-0"
            />
        {/if}
        {#if expanded}
            <Text textColor={disabled ? 'secondary' : selected ? 'brand' : 'primary'}>{tab.label}</Text>
        {/if}
    </div>
    {#if (selected || hover) && expanded}
        <Icon name={IconName.ChevronRight} textColor={selected ? 'brand' : 'primary'} />
    {/if}
</button>
{#if tooltip}
    <Tooltip anchor={buttonElement} placement="right" text={tooltip} event="hover" />
{/if}

<style lang="postcss">
    button {
        @apply flex flex-row flex-grow justify-between;
        @apply w-full;
        @apply py-2.5 px-3 rounded-[10px];

        &.selected,
        &:hover {
            @apply bg-surface-2 dark:bg-surface-2-dark;
        }
    }
</style>

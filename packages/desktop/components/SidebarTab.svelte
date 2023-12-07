<script lang="ts">
    import { Icon, IconName, Indicator, Text } from '@bloomwalletio/ui'
    import { IDashboardSidebarTab, ISettingsSidebarTab } from '@desktop/routers'

    export let tab: IDashboardSidebarTab | ISettingsSidebarTab = undefined
    export let selected: boolean = false
    export let expanded: boolean = true

    let hover = false

    function onClick(): void {
        tab?.onClick()
    }
</script>

<button class:selected on:click={onClick} on:mouseenter={() => (hover = true)} on:mouseleave={() => (hover = false)}>
    <div class="flex flex-row items-center relative space-x-4">
        <Icon name={tab?.icon} textColor={selected ? 'brand' : 'primary'} />
        {#if tab?.notificationType}
            <Indicator
                size="sm"
                color={tab?.notificationType === 'warning' ? 'yellow' : 'red'}
                ping
                class="absolute top-0 right-0"
            />
        {/if}
        {#if expanded}
            <Text textColor={selected ? 'brand' : 'primary'}>{tab.label}</Text>
        {/if}
    </div>
    {#if (selected || hover) && expanded}
        <Icon name={IconName.ChevronRight} textColor={selected ? 'brand' : 'primary'} />
    {/if}
</button>

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

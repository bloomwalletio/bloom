<script lang="ts">
    import { Icon, IconName, Indicator, Text } from '@bloomwalletio/ui'
    import { dashboardRoute } from '@core/router'
    import { ISidebarTab } from '@desktop/routers'

    export let tab: ISidebarTab = undefined

    let hover = false
    $: selected = $dashboardRoute === tab?.route

    function onClick(): void {
        tab?.onClick()
    }
</script>

<button class:selected on:click={onClick} on:mouseenter={() => (hover = true)} on:mouseleave={() => (hover = false)}>
    <div class="flex flex-row relative space-x-4 pr-3">
        <Icon textColor={selected ? 'brand' : 'primary'} name={tab?.icon} />
        {#if tab?.notificationType}
            <Indicator
                size="sm"
                color={tab?.notificationType === 'warning' ? 'yellow' : 'red'}
                ping
                class="absolute top-0 right-0"
            />
        {/if}
        <Text textColor={selected ? 'brand' : 'primary'}>{tab.label}</Text>
    </div>
    {#if selected || hover}
        <Icon textColor={selected ? 'brand' : 'primary'} name={IconName.ChevronRight} />
    {/if}
</button>

<style lang="postcss">
    button {
        @apply flex flex-row flex-grow justify-between;
        @apply w-full;
        @apply py-2.5 px-3 rounded-md;

        &.selected,
        &:hover {
            @apply bg-surface-2 dark:bg-surface-2-dark;
        }
    }
</style>

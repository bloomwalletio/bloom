<script lang="ts">
    import { Icon, IconName, Indicator, Text } from '@bloomwalletio/ui'
    import { dashboardRoute } from '@core/router'
    import { ISidebarTab } from '@desktop/routers'

    export let tab: ISidebarTab = undefined

    let showChevron = false

    $: isSelected = $dashboardRoute === tab?.route
    $: color = showChevron || isSelected ? 'primary' : 'black'

    function onClick(): void {
        _showChevron(false)
        tab?.onClick()
    }

    function _showChevron(show: boolean): void {
        showChevron = show
    }
</script>

<button
    on:mouseenter={() => _showChevron(true)}
    on:mouseleave={() => _showChevron(false)}
    class:selected={isSelected}
    on:click={onClick}
>
    <div class="flex flex-row relative space-x-4 pr-3">
        <Icon {color} name={tab?.icon} />
        {#if tab?.notificationType}
            <Indicator
                size="sm"
                color={tab?.notificationType === 'warning' ? 'yellow' : 'red'}
                ping
                class="absolute top-0 right-0"
            />
        {/if}
        <Text {color} weight="semibold">{tab.label}</Text>
    </div>
    {#if showChevron}
        <Icon color="primary" name={IconName.ChevronRight} />
    {/if}
</button>

<style lang="postcss">
    button {
        @apply flex flex-row flex-grow justify-between;
        @apply w-full;
        @apply hover:bg-purple-100;
        @apply text-purple-500;
        @apply py-2.5 px-3 rounded-md;

        &.selected {
            @apply bg-purple-100;
        }
    }
</style>

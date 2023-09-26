<script lang="ts">
    import { Icon, IconName, Indicator, Text } from '@bloomwalletio/ui'
    import { dashboardRoute } from '@core/router'
    import { ISidebarTab } from '@desktop/routers'

    export let tab: ISidebarTab = undefined

    $: isSelected = $dashboardRoute === tab?.route
    $: color = isSelected ? 'primary' : 'text-primary'

    function onClick(): void {
        tab?.onClick()
    }
</script>

<button class:selected={isSelected} on:click={onClick}>
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
    {#if isSelected}
        <Icon {color} name={IconName.ChevronRight} />
    {/if}
</button>

<style lang="postcss">
    button {
        @apply flex flex-row flex-grow justify-between;
        @apply w-full;
        @apply hover:bg-surface-2 dark:hover:bg-surface-2-dark;
        @apply text-primary;
        @apply py-2.5 px-3 rounded-md;

        &.selected {
            @apply bg-surface-2 dark:bg-surface-2-dark;
        }
    }
</style>

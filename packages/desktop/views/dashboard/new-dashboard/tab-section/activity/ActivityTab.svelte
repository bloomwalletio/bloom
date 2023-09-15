<script lang="ts">
    import { time } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import {
        activityFilter,
        activitySearchTerm,
        queriedActivities,
        selectedAccountActivities,
        setAsyncStatusOfAccountActivities,
    } from '@core/activity'
    import { Text, FontWeight } from '@ui'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import ActivityListRow from './components/ActivityListRow.svelte'

    $: setAsyncStatusOfAccountActivities($time)

    $: $activityFilter, $activitySearchTerm, scrollToTop()
    $: isEmptyBecauseOfFilter =
        $selectedAccountActivities.filter((_activity) => !_activity.isHidden).length > 0 &&
        $queriedActivities.length === 0

    function scrollToTop(): void {
        const listElement = document.querySelector('.activity-list')?.querySelector('svelte-virtual-list-viewport')
        if (listElement) {
            listElement.scroll(0, 0)
        }
    }
</script>

<div class="h-full flex flex-auto flex-col flex-grow shrink-0">
    <div class="header-row">
        <Text fontWeight={FontWeight.medium} secondary classes="text-start"
            >{localize('views.dashboard.activity.asset')}</Text
        >
        <Text fontWeight={FontWeight.medium} secondary classes="text-start"
            >{localize('views.dashboard.activity.action')}</Text
        >
        <Text fontWeight={FontWeight.medium} secondary classes="text-start"
            >{localize('views.dashboard.activity.address')}</Text
        >
        <Text fontWeight={FontWeight.medium} secondary classes="text-end"
            >{localize('views.dashboard.activity.amount')}</Text
        >
    </div>
    <div class="flex-auto h-full">
        {#if $queriedActivities.length > 0}
            <VirtualList items={$queriedActivities} let:item>
                <ActivityListRow activity={item} />
            </VirtualList>
        {:else}
            <div class="h-full flex flex-col items-center justify-center text-center">
                <Text secondary>
                    {localize(`general.${isEmptyBecauseOfFilter ? 'noFilteredActivity' : 'noRecentHistory'}`)}
                </Text>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    .header-row {
        @apply w-full;
        @apply px-5 py-4;
        @apply bg-gray-50;
        @apply border-b border-solid border-gray-100;

        @apply grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
    }
</style>

<script lang="ts">
    import { time } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import {
        activityFilter,
        activitySearchTerm,
        getClaimableActivities,
        queriedActivities,
        selectedAccountActivities,
        setAsyncStatusOfAccountActivities,
    } from '@core/activity'
    import { Text, Icon, IconName } from '@bloomwalletio/ui'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import ActivityListRow from './components/ActivityListRow.svelte'

    $: setAsyncStatusOfAccountActivities($time)

    $: $activityFilter, $activitySearchTerm, scrollToTop()
    $: isEmptyBecauseOfFilter =
        $selectedAccountActivities.filter((_activity) => !_activity.isHidden).length > 0 &&
        $queriedActivities.length === 0

    let amountClaimableTransactions = 0
    $: $selectedAccountActivities, (amountClaimableTransactions = getClaimableActivities()?.length)

    function scrollToTop(): void {
        const listElement = document.querySelector('.activity-list')?.querySelector('svelte-virtual-list-viewport')
        if (listElement) {
            listElement.scroll(0, 0)
        }
    }
</script>

<activity-tab>
    <header-row>
        <Text type="sm" fontWeight="medium" textColor="secondary">{localize('views.dashboard.activity.activity')}</Text>
        <Text type="sm" fontWeight="medium" textColor="secondary">{localize('views.dashboard.activity.date')}</Text>
        <Text type="sm" fontWeight="medium" textColor="secondary">{localize('views.dashboard.activity.address')}</Text>
        <div class="text-end">
            <Text type="sm" fontWeight="medium" textColor="secondary">
                {localize('views.dashboard.activity.asset')}
            </Text>
        </div>
        <div class="text-end">
            <Text type="sm" fontWeight="medium" textColor="secondary">
                {localize('views.dashboard.activity.fee')}
            </Text>
        </div>
    </header-row>
    {#if amountClaimableTransactions}
        <info-section class="flex flex-row items-center">
            <Icon name={IconName.BellRinging} size="sm" customColor="warning" />
            <Text customColor="warning"
                >{localize('views.dashboard.activity.claimableTransactions', {
                    amount: amountClaimableTransactions,
                })}</Text
            >
        </info-section>
    {/if}
    {#if $queriedActivities.length > 0}
        <VirtualList items={$queriedActivities} let:item itemHeight={69}>
            <ActivityListRow activity={item} />
        </VirtualList>
    {:else}
        <div class="h-full flex flex-col items-center justify-center text-center">
            <Text textColor="secondary">
                {localize(`general.${isEmptyBecauseOfFilter ? 'noFilteredActivity' : 'noRecentHistory'}`)}
            </Text>
        </div>
    {/if}
</activity-tab>

<style lang="scss">
    $paneHeaderHeight: 68px;

    activity-tab {
        @apply flex flex-col flex-grow;
        height: calc(100% - $paneHeaderHeight);

        header-row {
            @apply w-full;
            @apply pl-5 py-2 pr-7;
            @apply bg-surface-1 dark:bg-surface-1-dark;
            @apply border-y border-solid border-stroke dark:border-stroke-dark;

            @apply grid gap-8;
            grid-template-columns: 3fr 1fr 2fr 2fr 1fr;
        }

        info-section {
            @apply px-5 py-1.5 gap-2;
            @apply bg-warning/10;
        }
    }
</style>

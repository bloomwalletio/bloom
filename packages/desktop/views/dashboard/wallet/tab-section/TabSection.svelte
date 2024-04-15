<script lang="ts">
    import { Tabs } from '@bloomwalletio/ui'
    import { ActivityListMenu, Filter, TokenListMenu } from '@components'
    import { activityFilter, activitySearchTerm } from '@core/activity'
    import { localize } from '@core/i18n'
    import { tokenFilter, tokenSearchTerm } from '@core/token/stores'
    import { SearchInput } from '@ui'
    import { ActivityTab } from './activity'
    import { PortfolioTab } from './portfolio'
    import { selectedWalletTabIndex } from '@contexts/wallet/stores'

    const TABS = [
        { key: 'portfolio', value: localize('views.dashboard.portfolio.tab') },
        { key: 'activity', value: localize('views.dashboard.activity.tab') },
    ]

    let selectedTab = TABS[$selectedWalletTabIndex]
</script>

<top-section class="flex flex-row justify-between px-5 py-4 items-center">
    <div class="w-64">
        <Tabs bind:selectedTab bind:selectedIndex={$selectedWalletTabIndex} tabs={TABS} />
    </div>
    <div class="flex flex-row gap-2 items-center">
        {#if selectedTab.key === 'activity'}
            <SearchInput bind:value={$activitySearchTerm} />
            <Filter filterStore={activityFilter} />
            <ActivityListMenu />
        {:else if selectedTab.key === 'portfolio'}
            <SearchInput bind:value={$tokenSearchTerm} />
            <Filter filterStore={tokenFilter} />
            <TokenListMenu />
        {/if}
    </div>
</top-section>

{#if selectedTab.key === 'activity'}
    <ActivityTab />
{:else if selectedTab.key === 'portfolio'}
    <PortfolioTab />
{/if}

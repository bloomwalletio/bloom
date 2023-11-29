<script lang="ts">
    import { Tabs } from '@bloomwalletio/ui'
    import { Filter, TokenListMenu } from '@components'
    import { activityFilter, activitySearchTerm } from '@core/activity'
    import { localize } from '@core/i18n'
    import { tokenFilter, tokenSearchTerm } from '@core/token/stores'
    import { SearchInput } from '@ui'
    import { ActivityTab } from './activity'
    import { PortfolioTab } from './portfolio'
    import features from '@features/features'

    const TABS = [
        { key: 'activity', value: localize('views.dashboard.activity.tab') },
        { key: 'portfolio', value: localize('views.dashboard.portfolio.tab') },
    ]

    let selectedTab = TABS[0]
</script>

<top-section class="flex flex-row justify-between px-5 py-4 items-center">
    <div class="w-64">
        <Tabs bind:selectedTab tabs={TABS} />
    </div>
    <div class="flex flex-row gap-2 items-center">
        {#if selectedTab.key === 'activity'}
            <SearchInput bind:value={$activitySearchTerm} />
            <Filter filterStore={activityFilter} />
        {:else if selectedTab.key === 'portfolio'}
            <SearchInput bind:value={$tokenSearchTerm} />
            {#if features.wallet.portfolio.filter.enabled}
                <Filter filterStore={tokenFilter} />
            {/if}
            <TokenListMenu />
        {/if}
    </div>
</top-section>

{#if selectedTab.key === 'activity'}
    <ActivityTab />
{:else if selectedTab.key === 'portfolio'}
    <PortfolioTab />
{/if}

<script lang="ts">
    import { Tabs } from '@bloomwalletio/ui'
    import { Filter, TokenListMenu } from '@components'
    import { activityFilter, activitySearchTerm } from '@core/activity'
    import { localize } from '@core/i18n'
    import { tokenFilter, tokenSearchTerm } from '@core/token/stores'
    import { SearchInput } from '@ui'
    import { ActivityTab } from './activity'
    import { PortfolioTab } from './portfolio'

    let currentTab = 0
</script>

<top-section class="flex flex-row justify-between px-5 py-4 items-center">
    <Tabs
        bind:currentTab
        tabs={[localize('views.dashboard.activity.tab'), localize('views.dashboard.portfolio.tab')]}
    />
    <div class="flex flex-row gap-1 items-center">
        {#if currentTab === 0}
            <SearchInput bind:value={$activitySearchTerm} />
            <Filter filterStore={activityFilter} />
        {:else if currentTab === 1}
            <SearchInput bind:value={$tokenSearchTerm} />
            <Filter filterStore={tokenFilter} />
            <TokenListMenu />
        {/if}
    </div>
</top-section>

{#if currentTab === 0}
    <ActivityTab />
{:else if currentTab === 1}
    <PortfolioTab />
{/if}

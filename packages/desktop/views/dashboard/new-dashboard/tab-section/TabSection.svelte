<script lang="ts">
    import { Tabs } from '@bloomwalletio/ui'
    import { ActivityTab } from './activity'
    import { PortfolioTab } from './portfolio'
    import { localize } from '@core/i18n'
    import { Filter, TokenListMenu } from '@components'
    import { tokenFilter } from '@core/token/stores'
    import { SearchInput } from '@ui'
    import { activityFilter, activitySearchTerm } from '@core/activity'

    let currentTab = 0
</script>

<top-section class="flex flex-row justify-between px-5 py-4">
    <Tabs
        bind:currentTab
        tabs={[localize('views.dashboard.activity.tab'), localize('views.dashboard.portfolio.tab')]}
    />
    <div class="flex flex-row gap-2 items-center">
        <div class="flex items-center" style="height: 36px">
            {#if currentTab === 0}
                <SearchInput bind:value={$activitySearchTerm} />
            {/if}
        </div>
        {#if currentTab === 0}
            <Filter filterStore={activityFilter} />
        {:else if currentTab === 1}
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

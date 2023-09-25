<script lang="ts">
    import { Tabs, IconButton, IconName } from '@bloomwalletio/ui'
    import { ActivityTab } from './activity'
    import { PortfolioTab } from './portfolio'
    import { localize } from '@core/i18n'
    import { Filter } from '@components'
    import { tokenFilter, tokenSearchTerm } from '@core/token/stores'
    import { SearchInput } from '@ui'
    import { activityFilter, activitySearchTerm } from '@core/activity'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'

    let currentTab = 0

    function onImportErc20TokenClick(): void {
        openPopup({
            id: PopupId.ImportErc20Token,
            overflow: true,
        })
    }
</script>

<top-section class="flex flex-row justify-between px-5 py-4">
    <Tabs
        bind:currentTab
        tabs={[localize('views.dashboard.activity.tab'), localize('views.dashboard.portfolio.tab')]}
    />
    <div class="flex flex-row gap-2 items-center">
        {#if currentTab === 0}
            <div class="flex items-center" style="height: 36px">
                <SearchInput bind:value={$activitySearchTerm} />
            </div>
            <Filter filterStore={activityFilter} />
        {:else if currentTab === 1}
            <IconButton icon={IconName.Plus} on:click={onImportErc20TokenClick} />
            <div class="flex items-center" style="height: 36px">
                <SearchInput bind:value={$tokenSearchTerm} />
            </div>
            <Filter filterStore={tokenFilter} />
        {/if}
    </div>
</top-section>

{#if currentTab === 0}
    <ActivityTab />
{:else if currentTab === 1}
    <PortfolioTab />
{/if}

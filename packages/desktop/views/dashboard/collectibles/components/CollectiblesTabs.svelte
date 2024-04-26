<script lang="ts">
    import { Tabs } from '@bloomwalletio/ui'
    import { COLLECTIBLES_TABS } from '@core/nfts'
    import { selectedCollectiblesTab } from '@core/nfts/stores'

    const selectedIndex = COLLECTIBLES_TABS.findIndex((tab) => tab.key === $selectedCollectiblesTab?.key)
</script>

{#if COLLECTIBLES_TABS.length > 1}
    <div class="w-64">
        <Tabs {selectedIndex} bind:selectedTab={$selectedCollectiblesTab} tabs={COLLECTIBLES_TABS} />
    </div>
{/if}

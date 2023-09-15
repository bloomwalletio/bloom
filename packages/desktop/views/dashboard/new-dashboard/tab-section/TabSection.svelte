<script lang="ts">
    import { ActivityTab } from './activity'
    import { PortfolioTab } from './portfolio'

    const currentTab = 0
</script>

{#if currentTab === 0}
    <ActivityTab />
{:else if currentTab === 1}
    <PortfolioTab />
{/if}

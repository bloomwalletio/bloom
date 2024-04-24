<script lang="ts">
    import { Tabs } from '@bloomwalletio/ui'
    import { CollectiblesRoute, collectiblesRoute, collectiblesRouter } from '@core/router'
    import { KeyValue } from '@ui'

    const tabs: KeyValue<string>[] = [
        { key: 'collectibles', value: 'Collectibles' },
        { key: 'collections', value: 'Collections' },
    ]

    const selectedIndex = $collectiblesRoute === CollectiblesRoute.Gallery ? 0 : 1

    let selectedTab = tabs[selectedIndex]

    $: selectedTab.key === tabs[0].key
        ? $collectiblesRouter?.goTo(CollectiblesRoute.Gallery)
        : $collectiblesRouter?.goTo(CollectiblesRoute.CollectionsGallery)
</script>

<div class="w-64">
    <Tabs {selectedIndex} bind:selectedTab {tabs} />
</div>

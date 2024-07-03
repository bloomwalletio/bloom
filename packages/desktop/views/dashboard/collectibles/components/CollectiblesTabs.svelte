<script lang="ts">
    import { Tabs } from '@bloomwalletio/ui'
    import { selectedCollectiblesTab } from '@core/nfts/stores'
    import { KeyValue } from '@ui'
    import features from '@features/features'
    import { localize } from '@core/i18n'

    const COLLECTIBLES_TABS: KeyValue<string>[] = [
        { key: 'collectibles', value: localize('views.collectibles.gallery.title') },
        ...(features.collectibles?.collections.enabled
            ? [{ key: 'collections', value: localize('views.collectibles.collectionsGallery.title') }]
            : []),
    ]
</script>

{#if COLLECTIBLES_TABS.length > 1}
    <div class="w-64">
        <Tabs
            bind:selectedIndex={$selectedCollectiblesTab}
            selectedTab={COLLECTIBLES_TABS[$selectedCollectiblesTab]}
            tabs={COLLECTIBLES_TABS}
        />
    </div>
{/if}

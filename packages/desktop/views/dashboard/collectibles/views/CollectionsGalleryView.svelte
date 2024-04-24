<script lang="ts">
    import { Button, IconName, Pill, Text } from '@bloomwalletio/ui'
    import { CollectiblesListMenu, EmptyListPlaceholder } from '@components'
    import { Filter } from '@components/filter'
    import { localize } from '@core/i18n'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { SearchInput } from '@ui'
    import { writable } from 'svelte/store'
    import { CollectiblesTabs } from '../components'
    import { onMount } from 'svelte'
    import { collectiblesRouter } from '@core/router'

    function onReceiveClick(): void {
        openPopup({
            id: PopupId.ReceiveAddress,
        })
    }

    // MOCKS
    const collections: { name: string }[] = []
    let collectionSearchTerm = ''
    const collectionFilter = writable(undefined)
    const ownedCollections = collections
    let queriedCollections: typeof collections = []
    $: collectionSearchTerm,
        collectionFilter,
        (queriedCollections = ownedCollections
            .filter((collection) => collection)
            .sort((collection1, collection2) =>
                collection1.name.toLowerCase().localeCompare(collection2.name.toLowerCase())
            ))

    onMount(() => {
        $collectiblesRouter?.setBreadcrumb(localize('views.collectibles.collectionsGallery.title'))
    })
</script>

<collections-gallery-view class="flex flex-col w-full h-full gap-4">
    <header class="flex flex-row items-center justify-between">
        <div class="flex flex-row text-left gap-2 items-center flex-1">
            <Text type="h6">{localize('views.collectibles.collectionsGallery.title')}</Text>
            <Pill color="neutral">
                <Text textColor="secondary">{String(queriedCollections.length ?? '')}</Text>
            </Pill>
        </div>
        <CollectiblesTabs />
        <div class="flex justify-end items-center gap-5 h-10 shrink-0 flex-1">
            {#if collections.length}
                <SearchInput bind:value={collectionSearchTerm} />
                <Filter filterStore={collectionFilter} />
            {/if}
            {#if features.collectibles.erc721.enabled}
                <CollectiblesListMenu />
            {/if}
        </div>
    </header>
    {#if collections.length}
        {#if queriedCollections.length}
            <!-- <CollectionsGallery collections={queriedCollections} /> -->
        {:else}
            <div class="w-full h-full flex flex-col items-center justify-center">
                <EmptyListPlaceholder
                    title={localize('views.collectibles.collectionsGallery.noResults')}
                    icon={IconName.Data}
                />
            </div>
        {/if}
    {:else}
        <div class="w-full h-full flex flex-col items-center justify-center grow-1 gap-6">
            <EmptyListPlaceholder
                title={localize('views.collectibles.collectionsGallery.emptyTitle')}
                subtitle={localize('views.collectibles.collectionsGallery.emptyDescription')}
                icon={IconName.Data}
            />
            <Button text={localize('actions.getStarted')} on:click={onReceiveClick} />
        </div>
    {/if}
</collections-gallery-view>

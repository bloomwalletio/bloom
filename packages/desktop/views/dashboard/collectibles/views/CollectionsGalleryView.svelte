<script lang="ts">
    import { Button, IconName, Pill, Text } from '@bloomwalletio/ui'
    import { CollectiblesListMenu, EmptyListPlaceholder } from '@components'
    import { localize } from '@core/i18n'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { SearchInput } from '@ui'
    import { CollectiblesTabs, CollectionsGallery } from '../components'
    import { collectionsSearchTerm, ownedNfts, persistedCollections } from '@core/nfts/stores'
    import { isVisibleCollection } from '@core/nfts'

    let queriedCollectionsIds: string[] = []

    $: collectionsIds = $ownedNfts?.reduce((set, nft) => {
        if (!nft.hidden && !nft.isScam && nft.collectionId && $persistedCollections[nft.collectionId]) {
            set.add(nft.collectionId)
        }
        return set
    }, new Set<string>())

    $: $collectionsSearchTerm, collectionsIds, setQueriedCollectionsIds()

    function setQueriedCollectionsIds(): void {
        queriedCollectionsIds = Array.from(collectionsIds)
            ?.filter((collectionId) => isVisibleCollection($persistedCollections[collectionId]))
            .sort((collectionId1, collectionId2) =>
                $persistedCollections[collectionId1]?.name
                    .toLowerCase()
                    .localeCompare($persistedCollections[collectionId2]?.name.toLowerCase())
            )
    }

    function onReceiveClick(): void {
        openPopup({
            id: PopupId.ReceiveAddress,
        })
    }
</script>

<collections-gallery-view class="flex flex-col w-full h-full gap-4">
    <header class="flex flex-row items-center justify-between">
        <div class="flex flex-row text-left gap-2 items-center flex-1">
            <Text type="h6">{localize('views.collectibles.collectionsGallery.title')}</Text>
            <Pill color="neutral">
                <Text textColor="secondary">{String(collectionsIds.size ?? '')}</Text>
            </Pill>
        </div>
        <CollectiblesTabs />
        <div class="flex justify-end items-center gap-5 h-10 shrink-0 flex-1">
            {#if collectionsIds.size}
                <SearchInput bind:value={$collectionsSearchTerm} />
            {/if}
            {#if features.collectibles.erc721.enabled}
                <CollectiblesListMenu />
            {/if}
        </div>
    </header>
    {#if collectionsIds.size}
        {#if queriedCollectionsIds.length > 0}
            <CollectionsGallery collectionsIds={queriedCollectionsIds} />
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

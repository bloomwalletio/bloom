<script lang="ts">
    import { Button, IconName, Pill, Text } from '@bloomwalletio/ui'
    import { CollectiblesListMenu, EmptyListPlaceholder } from '@components'
    import { Filter } from '@components/filter'
    import { localize } from '@core/i18n'
    import { Nft } from '@core/nfts/interfaces'
    import { nftFilter, nftSearchTerm, ownedNfts } from '@core/nfts/stores'
    import { isVisibleNft } from '@core/nfts/utils'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { NftGallery, SearchInput } from '@ui'
    import { CollectiblesTabs } from '../components'

    let queriedNfts: Nft[] = []
    $: $nftSearchTerm,
        $nftFilter,
        (queriedNfts = $ownedNfts
            .filter((nft) => isVisibleNft(nft))
            .sort((nft1, nft2) => nft1.name.toLowerCase().localeCompare(nft2.name.toLowerCase())))

    function onReceiveClick(): void {
        openPopup({
            id: PopupId.ReceiveAddress,
        })
    }
</script>

<collectibles-gallery-view class="flex flex-col w-full h-full gap-4">
    <header class="flex flex-row items-center justify-between">
        <div class="flex flex-row text-left gap-2 items-center flex-1">
            <Text type="h6">{localize('views.collectibles.gallery.title')}</Text>
            <Pill color="neutral">
                <Text textColor="secondary">{String(queriedNfts.length ?? '')}</Text>
            </Pill>
        </div>
        {#if features.collectibles.collections.enabled}
            <CollectiblesTabs />
        {/if}
        <div class="flex justify-end items-center gap-5 h-10 shrink-0 flex-1">
            {#if $ownedNfts.length}
                <SearchInput bind:value={$nftSearchTerm} />
                <Filter filterStore={nftFilter} />
            {/if}
            {#if features.collectibles.erc721.enabled}
                <CollectiblesListMenu />
            {/if}
        </div>
    </header>
    {#if $ownedNfts.length}
        {#if queriedNfts.length}
            <NftGallery nfts={queriedNfts} />
        {:else}
            <div class="w-full h-full flex flex-col items-center justify-center">
                <EmptyListPlaceholder title={localize('views.collectibles.gallery.noResults')} icon={IconName.Data} />
            </div>
        {/if}
    {:else}
        <div class="w-full h-full flex flex-col items-center justify-center grow-1 gap-6">
            <EmptyListPlaceholder
                title={localize('views.collectibles.gallery.emptyTitle')}
                subtitle={localize('views.collectibles.gallery.emptyDescription')}
                icon={IconName.Data}
            />
            <Button text={localize('actions.getStarted')} on:click={onReceiveClick} />
        </div>
    {/if}
</collectibles-gallery-view>

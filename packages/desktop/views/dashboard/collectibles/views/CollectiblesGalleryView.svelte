<script lang="ts">
    import { localize } from '@core/i18n'
    import { nftSearchTerm, ownedNfts, queriedNfts } from '@core/nfts/stores'
    import { NftGallery, SearchInput } from '@ui'
    import { Button, IconName, Text, Pill } from '@bloomwalletio/ui'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { getActiveNetworkId } from '@core/network'
    import features from '@features/features'
    import { CollectiblesListMenu, EmptyListPlaceholder } from '@components'

    function onReceiveClick(): void {
        openPopup({
            id: PopupId.ReceiveAddress,
            props: {
                selectedNetworkId: getActiveNetworkId(),
            },
        })
    }
</script>

<collectibles-gallery-view>
    <div class="flex flex-row justify-between">
        <div class="flex flex-row text-left gap-2 items-center">
            <Text type="h6">{localize('views.collectibles.gallery.title')}</Text>
            <Pill color="neutral">
                <Text textColor="secondary">{String($queriedNfts.length ?? '')}</Text>
            </Pill>
        </div>
        <div class="flex items-center gap-2" style="height: 40px">
            {#if $ownedNfts.length}
                <SearchInput bind:value={$nftSearchTerm} />
            {/if}
            {#if features.collectibles.erc721.enabled}
                <CollectiblesListMenu />
            {/if}
        </div>
    </div>
    {#if $ownedNfts.length}
        {#if $queriedNfts.length}
            <NftGallery nfts={$queriedNfts} />
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

<style lang="postcss">
    collectibles-gallery-view {
        @apply flex flex-col w-full h-full gap-4;
    }
</style>

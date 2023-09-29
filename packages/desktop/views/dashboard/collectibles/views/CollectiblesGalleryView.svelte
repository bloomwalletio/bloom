<script lang="ts">
    import { localize } from '@core/i18n'
    import { nftSearchTerm, ownedNfts, queriedNfts } from '@core/nfts/stores'
    import { Illustration, NftGallery, ReceiveButton, SearchInput } from '@ui'
    import { Text, Avatar } from '@bloomwalletio/ui'
</script>

<div class="flex flex-col w-full h-full space-y-4">
    {#if $ownedNfts.length}
        <div class="flex flex-row justify-between">
            <div class="flex flex-row text-left gap-2 items-center">
                <Text type="h6" textColor="brand">{localize('views.collectibles.gallery.title')}</Text>
                <Avatar
                    text={String($queriedNfts.length ?? '')}
                    size="base"
                    shape="square"
                    textColor="secondary"
                    backgroundColor="neutral/20"
                />
            </div>
            <div class="flex items-center" style="height: 40px">
                <SearchInput bind:value={$nftSearchTerm} />
            </div>
        </div>

        {#if $queriedNfts.length}
            <NftGallery nfts={$queriedNfts} />
        {:else}
            <div class="w-full h-full flex flex-col items-center justify-center space-y-8">
                <Illustration illustration="empty-collectibles" width="134" height="134" />
                <Text textColor="secondary">{localize('views.collectibles.gallery.noResults')}</Text>
            </div>
        {/if}
    {:else}
        <div class="w-full h-full flex items-center justify-center grow-1">
            <div class="flex flex-col items-center space-y-8">
                <Illustration illustration="empty-collectibles" width="134" height="134" />
                <div class="flex flex-col items-center">
                    <Text textColor="secondary">{localize('views.collectibles.gallery.emptyTitle')}</Text>
                    <Text textColor="secondary">{localize('views.collectibles.gallery.emptyDescription')}</Text>
                </div>
                <ReceiveButton text={localize('actions.depositNft')} />
            </div>
        </div>
    {/if}
</div>

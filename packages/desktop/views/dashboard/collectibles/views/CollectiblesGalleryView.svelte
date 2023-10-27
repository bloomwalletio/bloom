<script lang="ts">
    import { localize } from '@core/i18n'
    import { nftSearchTerm, ownedNfts, queriedNfts } from '@core/nfts/stores'
    import { NftGallery, SearchInput } from '@ui'
    import { Button, Icon, IconName, Text, Pill } from '@bloomwalletio/ui'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { getActiveNetworkId } from '@core/network'

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
    {#if $ownedNfts.length}
        <div class="flex flex-row justify-between">
            <div class="flex flex-row text-left gap-2 items-center">
                <Text type="h6">{localize('views.collectibles.gallery.title')}</Text>
                <Pill color="neutral">
                    <Text textColor="secondary">{String($queriedNfts.length ?? '')}</Text>
                </Pill>
            </div>
            <div class="flex items-center" style="height: 40px">
                <SearchInput bind:value={$nftSearchTerm} />
            </div>
        </div>

        {#if $queriedNfts.length}
            <NftGallery nfts={$queriedNfts} />
        {:else}
            <div class="w-full h-full flex flex-col items-center justify-center gap-6">
                <empty-list-icon>
                    <Icon name={IconName.Data} size="md" customColor="primary-500" />
                </empty-list-icon>
                <Text type="h6">{localize('views.collectibles.gallery.noResults')}</Text>
            </div>
        {/if}
    {:else}
        <div class="w-full h-full flex items-center justify-center grow-1">
            <div class="flex flex-col items-center gap-6">
                <empty-list-icon>
                    <Icon name={IconName.Data} size="md" customColor="primary-500" />
                </empty-list-icon>
                <div class="flex flex-col items-center gap-4">
                    <Text type="h6">{localize('views.collectibles.gallery.emptyTitle')}</Text>
                    <Text textColor="secondary">{localize('views.collectibles.gallery.emptyDescription')}</Text>
                </div>
                <Button text={localize('actions.getStarted')} on:click={onReceiveClick} />
            </div>
        </div>
    {/if}
</collectibles-gallery-view>

<style lang="postcss">
    collectibles-gallery-view {
        @apply flex flex-col w-full h-full gap-4;
    }

    empty-list-icon {
        @apply flex items-center justify-center text-center;
        @apply h-24 w-24 rounded-full shadow-elevation-4;
        @apply bg-surface dark:bg-surface-dark;
    }
</style>

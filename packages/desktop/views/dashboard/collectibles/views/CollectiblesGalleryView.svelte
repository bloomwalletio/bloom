<script lang="ts">
    import { localize } from '@core/i18n'
    import { nftSearchTerm, ownedNfts, queriedNfts } from '@core/nfts/stores'
    import { NftGallery, SearchInput } from '@ui'
    import { Avatar, Button, IconName, Text, Pill } from '@bloomwalletio/ui'
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

<div class="flex flex-col w-full h-full space-y-4">
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
                <Avatar icon={IconName.Data} size="xxxl" customTextColor="primary-500" backgroundColor="surface" />
                <Text type="h6">{localize('views.collectibles.gallery.noResults')}</Text>
            </div>
        {/if}
    {:else}
        <div class="w-full h-full flex items-center justify-center grow-1">
            <div class="flex flex-col items-center gap-6">
                <Avatar icon={IconName.Data} size="xxxl" customTextColor="primary-500" backgroundColor="surface" />
                <div class="flex flex-col items-center gap-4">
                    <Text type="h6">{localize('views.collectibles.gallery.emptyTitle')}</Text>
                    <Text textColor="secondary">{localize('views.collectibles.gallery.emptyDescription')}</Text>
                </div>
                <Button text={localize('actions.getStarted')} on:click={onReceiveClick} />
            </div>
        </div>
    {/if}
</div>

<script lang="ts">
    import { AssetPillsForNft, MediaPlaceholder, NetworkAvatar, NftMedia } from '@ui'
    import { Pill, Text } from '@bloomwalletio/ui'
    import { downloadingNftId, ownedNfts, persistedCollections, selectedCollectionId } from '@core/nfts/stores'
    import { localize } from '@core/i18n'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'

    export let collectionId: string

    function onCollectionClick(): void {
        $selectedCollectionId = collection.id
        $collectiblesRouter?.goTo(CollectiblesRoute.Details)
        $collectiblesRouter?.setBreadcrumb(collection.name)
    }

    $: collection = $persistedCollections[collectionId]
    $: nfts = $ownedNfts.filter((nft) => nft.collectionId === collectionId && !nft.hidden && !nft.isScam)
</script>

{#if collection && nfts.length > 0}
    <button type="button" on:click={onCollectionClick}>
        <div class="container">
            <div class="flex-1 flex relative bg-surface-2 dark:bg-surface-2-dark rounded-t-[0.9rem] overflow-hidden">
                <!-- TODO: change media to collection URI instead of first NFT URI -->
                <NftMedia nft={nfts[0]} classes="min-w-full min-h-full object-cover" loop muted>
                    <MediaPlaceholder
                        type={nfts[0]?.type}
                        downloading={$downloadingNftId === nfts[0]?.id}
                        size="md"
                        slot="placeholder"
                    />
                </NftMedia>
            </div>
            <div class="w-full flex flex-col gap-2 p-3">
                <nft-name class="w-full flex flex-row items-center gap-2 overflow-hidden">
                    <Text type="body2" truncate>{collection.name}</Text>
                </nft-name>
                <nft-pills class="flex flex-row items-center gap-2">
                    <NetworkAvatar networkId={nfts[0]?.networkId} size="sm" showTooltip />
                    <AssetPillsForNft nft={nfts[0]} />
                    <Pill compact color="brand">{localize('general.nfts', { count: nfts.length })}</Pill>
                </nft-pills>
            </div>
        </div>
    </button>
{/if}

<style lang="postcss">
    .container {
        @apply relative w-full flex flex-col mt-4;
        @apply divide-y divide-solid divide-stroke dark:divide-stroke-dark;
        @apply rounded-2xl border-2 border-solid border-stroke dark:border-stroke-dark;
        @apply bg-surface-1 dark:bg-surface-1-dark;
        @apply duration-300 z-[2];
        transition-property: background-color, border-color, box-shadow;
        aspect-ratio: 3 / 4;

        &:hover,
        &:focus {
            @apply shadow-lg dark:shadow-violet-900/25;
            @apply border-2 border-brand-500;
            @apply bg-surface dark:bg-surface-dark;
        }
    }

    button {
        @apply relative;

        &::after,
        &::before {
            @apply content-[''] absolute block left-0 right-0 z-[1];
            @apply rounded-2xl border-t-2 border-x-2 border-solid border-stroke dark:border-stroke-dark;
            @apply bg-surface-1 dark:bg-surface-1-dark;
            aspect-ratio: 3 / 4;
        }

        &::after {
            @apply top-2.5 mx-2;
        }

        &::before {
            @apply top-[0.2rem] mx-4 blur-[1px];
        }
    }
</style>

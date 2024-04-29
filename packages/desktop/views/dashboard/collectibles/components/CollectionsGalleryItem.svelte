<script lang="ts">
    import { Collection } from '@core/nfts'
    import { AssetPillsForNft, MediaPlaceholder, NetworkAvatar, NftMedia } from '@ui'
    import { Pill, Text } from '@bloomwalletio/ui'
    import { downloadingNftId } from '@core/nfts/stores'
    import { localize } from '@core/i18n'

    export let collection: Collection

    function onCollectionClick(): void {
        return
    }
</script>

<button type="button" on:click={onCollectionClick}>
    <div class="flex-1 flex relative bg-surface-2 dark:bg-surface-2-dark rounded-t-[0.9rem] overflow-hidden">
        <!-- TODO: change media to collection URI instead of first NFT URI -->
        <NftMedia nft={collection.nfts[0]} classes="min-w-full min-h-full object-cover" loop muted>
            <MediaPlaceholder
                type={collection.nfts[0]?.type}
                downloading={$downloadingNftId === collection.nfts[0]?.id}
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
            <NetworkAvatar networkId={collection.nfts[0].networkId} size="sm" showTooltip />
            <AssetPillsForNft nft={collection.nfts[0]} />
            <Pill compact color="primary">{localize('general.nfts', { count: collection.nfts.length })}</Pill>
        </nft-pills>
    </div>
</button>

<style lang="postcss">
    button {
        @apply relative w-full flex flex-col mt-4;
        @apply divide-y divide-solid divide-stroke dark:divide-stroke-dark;
        @apply rounded-2xl border-2 border-solid border-stroke dark:border-stroke-dark;
        @apply bg-surface-1 dark:bg-surface-1-dark;
        @apply duration-300;
        transition-property: background-color, border-color, box-shadow;
        aspect-ratio: 3 / 4;

        &:hover,
        &:focus {
            @apply shadow-lg dark:shadow-violet-900/25;
            @apply border-2 border-brand-500;
            @apply bg-surface dark:bg-surface-dark;
        }

        &::after {
            @apply content-[''] absolute block h-1.5 -top-2 left-0 right-0;
            @apply rounded-t-2xl mx-2;
            @apply border-t-2 border-x-2 border-solid border-stroke dark:border-stroke-dark;
            @apply bg-surface-1 dark:bg-surface-1-dark;
        }

        &::before {
            @apply content-[''] absolute block h-1.5 -top-3.5 left-0 right-0;
            @apply rounded-t-2xl mx-4;
            @apply border-t-2 border-x-2 border-solid border-stroke dark:border-stroke-dark;
            @apply bg-surface-1 dark:bg-surface-1-dark;
            @apply blur-[1px];
        }
    }
</style>

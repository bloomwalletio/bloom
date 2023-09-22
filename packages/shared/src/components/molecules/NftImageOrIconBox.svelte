<script lang="ts">
    import { INft } from '@core/nfts'
    import { MediaPlaceholder, NftMedia } from '@ui'

    export let nft: INft
    export let size: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
    export let useCaching: boolean = true

    $: nftType = nft?.parsedMetadata?.type
    $: parentType = nftType?.split('/')?.[0]
</script>

<nft-box
    class="
        flex overflow-hidden shrink-0 rounded-md items-center justify-center {size}
        {nft?.downloadMetadata?.isLoaded ? '' : 'bg-gray-500'}
    "
>
    {#if parentType === 'image'}
        <NftMedia {nft} {useCaching} classes="h-full w-full object-cover">
            <div
                slot="placeholder"
                class="
                    w-full h-full
                    {size === 'sm' && 'p-1'}
                    {size === 'md' && 'p-2'}
                    {size === 'lg' && 'p-2'}
                "
            >
                <MediaPlaceholder type={nftType} iconOnly />
            </div>
        </NftMedia>
    {:else}
        <div
            class="
                w-full h-full
                {size === 'sm' && 'p-1'}
                {size === 'md' && 'p-2'}
                {size === 'lg' && 'p-2'}
            "
        >
            <MediaPlaceholder type={nftType} iconOnly />
        </div>
    {/if}
</nft-box>

<style lang="scss">
    nft-box {
        &.xl {
            @apply h-36 w-36;
        }

        &.lg {
            @apply h-20 w-20;
        }

        &.md {
            @apply h-10 w-10;
        }

        &.sm {
            @apply h-8 w-8;
        }

        &.xs {
            @apply h-6 w-6;
        }

        &.xxs {
            @apply h-4 w-4;
        }
    }
</style>

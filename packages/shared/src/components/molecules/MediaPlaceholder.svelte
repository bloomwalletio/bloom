<script lang="ts">
    import { INft } from '@core/nfts'
    import { TextColor, AvatarSize } from '@bloomwalletio/ui'
    import MediaIcon from './MediaIcon.svelte'

    export let nft: INft
    export let size: AvatarSize

    $: placeHolderColor = nft.downloadMetadata.error
        ? 'danger'
        : nft.downloadMetadata.warning
        ? 'warning'
        : ('brand' as TextColor)
</script>

<div class="w-full h-full flex justify-center items-center bg-surface-2 dark:bg-surface-2-dark">
    <placeholder-container class={size}>
        <MediaIcon type={nft?.parsedMetadata?.type} nftId={nft.id} textColor={placeHolderColor} {size} />
    </placeholder-container>
</div>

<style lang="scss">
    placeholder-container {
        @apply rounded-full;
        @apply bg-surface dark:bg-surface-dark;
        @apply flex items-center justify-center text-center;

        &.md {
            @apply h-20 w-20;
        }

        &.lg {
            @apply h-24 w-24;
        }
    }
</style>

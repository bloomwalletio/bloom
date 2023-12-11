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

<media-placeholder class="w-full h-full flex justify-center items-center bg-surface-2 dark:bg-surface-2-dark">
    <icon-container class={size}>
        <MediaIcon type={nft?.metadata?.type} nftId={nft.id} textColor={placeHolderColor} {size} />
    </icon-container>
</media-placeholder>

<style lang="scss">
    icon-container {
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

<script lang="ts">
    import { AvatarSize, TextColor } from '@bloomwalletio/ui'
    import { MimeType } from '@core/nfts'
    import MediaIcon from './MediaIcon.svelte'

    export let type: MimeType = MimeType.ImagePng
    export let size: AvatarSize
    export let textColor: TextColor = 'brand'
    export let downloading: boolean = false
</script>

<media-placeholder class="w-full h-full flex justify-center items-center bg-surface-2 dark:bg-surface-2-dark">
    <icon-container class={size}>
        <MediaIcon {type} {textColor} {size} {downloading} />
    </icon-container>
</media-placeholder>

<style lang="postcss">
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

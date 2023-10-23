<script lang="ts">
    import { MimeType, ParentMimeType } from '@core/nfts'
    import { TextColor, Icon, IconName, AvatarSize } from '@bloomwalletio/ui'
    import { nftDownloadQueue } from '@core/nfts/stores'

    export let type: MimeType | undefined
    export let nftId: string
    export let textColor: TextColor = 'primary'
    export let size: AvatarSize

    $: isDownloading = $nftDownloadQueue.some((queueItem) => queueItem.nft.id === nftId)

    function getIcon(type: MimeType | undefined): IconName {
        const parentMimeType = type?.split('/', 1)?.[0]
        switch (parentMimeType) {
            case ParentMimeType.Image:
                return IconName.ImageBorderless
            case ParentMimeType.Video:
                return IconName.PlaySquare
            case ParentMimeType.Audio:
                return IconName.Audio
            case ParentMimeType.Text:
                return IconName.TextFile
            case ParentMimeType.Application:
                return IconName.Application
            case ParentMimeType.Model:
                return IconName.Cube
            case ParentMimeType.Font:
                return IconName.Font
            default:
                return IconName.UnknownMediaType
        }
    }
</script>

<media-placeholder class={size} class:downloading={isDownloading}>
    <Icon name={getIcon(type)} {textColor} {size} />
</media-placeholder>

<style lang="scss">
    media-placeholder {
        @apply rounded-full;
        @apply bg-surface dark:bg-surface-dark;
        @apply flex items-center justify-center text-center;

        &.downloading {
            @apply animate-pulse;
        }

        &.md {
            @apply h-20 w-20;
        }

        &.lg {
            @apply h-24 w-24;
        }
    }
</style>

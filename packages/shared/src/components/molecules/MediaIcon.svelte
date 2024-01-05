<script lang="ts">
    import { MimeType, ParentMimeType } from '@core/nfts'
    import { TextColor, IconName, AvatarSize, Avatar } from '@bloomwalletio/ui'
    import { nftDownloadQueue } from '@core/nfts/stores'

    export let type: MimeType | undefined
    export let nftId: string | undefined = undefined
    export let textColor: TextColor = 'primary'
    export let size: AvatarSize
    export let surface: 0 | 1 | 2 | 'invert' | 'brand' = 0

    $: isDownloading = $nftDownloadQueue.some((_nft) => _nft.id === nftId)

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

<media-icon class:downloading={isDownloading}>
    <Avatar icon={getIcon(type)} {textColor} {size} {surface} />
</media-icon>

<style lang="scss">
    media-icon {
        &.downloading {
            @apply animate-pulse;
        }
    }
</style>

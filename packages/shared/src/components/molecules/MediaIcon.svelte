<script lang="ts">
    import { MimeType, ParentMimeType } from '@core/nfts'
    import { TextColor, IconName, AvatarSize, Avatar } from '@bloomwalletio/ui'

    export let type: MimeType | undefined
    export let textColor: TextColor = 'primary'
    export let size: AvatarSize
    export let surface: 0 | 1 | 2 | 'invert' | 'brand' = 0
    export let downloading: boolean = false

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

<media-icon class={downloading ? 'animate-pulse' : ''}>
    <Avatar icon={getIcon(type)} {textColor} {size} {surface} />
</media-icon>

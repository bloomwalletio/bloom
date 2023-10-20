<script lang="ts">
    import { MimeType, ParentMimeType } from '@core/nfts'
    import { TextColor, Icon, IconName } from '@bloomwalletio/ui'

    export let type: MimeType | undefined
    export let textColor: TextColor = 'primary'
    export let size: 'md' | 'lg' = 'lg'

    function getIcon(type: MimeType | undefined): IconName {
        const parentMimeType = type?.split('/', 1)?.[0]
        switch (parentMimeType) {
            case ParentMimeType.Image:
                return IconName.Image
            case ParentMimeType.Video:
                return IconName.Video
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

<media-placeholder class={size}>
    <Icon name={getIcon(type)} {textColor} {size} />
</media-placeholder>

<style lang="scss">
    media-placeholder {
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

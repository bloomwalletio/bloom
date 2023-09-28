<script lang="ts">
    import { MimeType, ParentMimeType } from '@core/nfts'
    import { Icon as OldIcon } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { appSettings } from '@core/app/stores'
    import { Icon, IconName } from '@bloomwalletio/ui'

    export let type: MimeType | undefined
    export let isDownloading = false
    export let smallIcon = false
    export let classes = ''

    // primaryColor: gives extra color customization outside of default text colors, used in CollectiblesImageLarge to change mountain color
    // secondaryColor: alters the large icon's circle color
    $: primaryColor = $appSettings.darkMode ? '#25395F' : '#C4D1E8'
    $: secondaryColor = $appSettings.darkMode ? '#F0F5FE' : '#D8E3F5'

    function getLargeIcons(type: MimeType | undefined): IconEnum {
        const parentMimeType = type?.split('/', 1)?.[0]
        switch (parentMimeType) {
            case ParentMimeType.Image:
                return IconEnum.CollectiblesImageLarge
            case ParentMimeType.Video:
                return IconEnum.CollectiblesVideoLarge
            case ParentMimeType.Audio:
                return IconEnum.CollectiblesAudioLarge
            case ParentMimeType.Text:
                return IconEnum.CollectiblesTextLarge
            case ParentMimeType.Application:
                return IconEnum.CollectiblesApplicationLarge
            case ParentMimeType.Model:
                return IconEnum.CollectiblesModelLarge
            case ParentMimeType.Font:
                return IconEnum.CollectiblesFontLarge
            default:
                return IconEnum.CollectiblesUnknownLarge
        }
    }

    function getSmallIcons(type: MimeType | undefined): IconName {
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

{#if smallIcon}
    <Icon name={getSmallIcons(type)} textColor="primary" />
{:else}
    <OldIcon
        icon={getLargeIcons(type)}
        width="100%"
        height="100%"
        {primaryColor}
        {secondaryColor}
        classes={`text-white dark:text-gray-800 bg-neutral-3 dark:bg-neutral-3-dark text-center ${
            isDownloading ? 'animate-pulse' : ''
        } ${classes}`}
    />
{/if}

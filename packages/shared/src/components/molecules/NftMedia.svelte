<script lang="ts">
    import { TextColor } from '@bloomwalletio/ui'
    import { INft, NFT_MEDIA_FILE_NAME } from '@core/nfts'
    import { nftDownloadQueue } from '@core/nfts/stores'
    import { DEV_STORAGE_DIRECTORY } from '@core/profile/constants'
    import { getStorageDirectoryOfProfiles } from '@core/profile/utils'
    import features from '@features/features'
    import { MediaDisplay, MediaPlaceholder } from '@ui'
    import { onMount } from 'svelte'

    export let nft: INft
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let loop: boolean = false
    export let muted: boolean = false
    export let classes: string = ''
    export let useCaching: boolean = true
    export let iconSize: 'md' | 'lg' = 'md'

    let hasMounted: boolean = false
    let basePath: string

    $: isDownloading = $nftDownloadQueue.some((queueItem) => queueItem.nft.id === nft.id)
    $: src =
        features?.collectibles?.useCaching?.enabled && useCaching
            ? `${basePath}/${nft.filePath}/${NFT_MEDIA_FILE_NAME}`
            : nft.downloadUrl

    $: placeHolderColor = nft.downloadMetadata.error
        ? 'danger'
        : nft.downloadMetadata.warning
        ? 'warning'
        : ('brand' as TextColor)

    onMount(async () => {
        if (process.env.NODE_ENV === 'development') {
            basePath = DEV_STORAGE_DIRECTORY
        } else {
            basePath = await getStorageDirectoryOfProfiles()
        }
        hasMounted = true
    })
</script>

{#if hasMounted && nft && nft.composedUrl && nft.parsedMetadata && (!useCaching || nft.downloadMetadata?.isLoaded)}
    <MediaDisplay
        {src}
        expectedType={nft.parsedMetadata.type}
        isLoaded={nft.downloadMetadata.isLoaded}
        {autoplay}
        {controls}
        {loop}
        {muted}
        {classes}
        alt={`Media display for ${nft.name}`}
    />
{:else}
    <div class="w-full h-full flex justify-center items-center bg-surface-2 dark:bg-center-2-dark">
        <MediaPlaceholder
            type={nft?.parsedMetadata?.type}
            {isDownloading}
            textColor={placeHolderColor}
            size={iconSize}
        />
    </div>
{/if}

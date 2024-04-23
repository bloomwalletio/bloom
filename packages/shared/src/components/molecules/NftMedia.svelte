<script lang="ts">
    import { isValidNftUri, Nft, NFT_MEDIA_FILE_NAME } from '@core/nfts'
    import { DEV_STORAGE_DIRECTORY } from '@core/profile/constants'
    import { getStorageDirectoryOfProfiles } from '@core/profile/utils'
    import features from '@features/features'
    import { MediaDisplay } from '@ui'
    import { onMount } from 'svelte'

    export let nft: Nft
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let loop: boolean = false
    export let muted: boolean = false
    export let classes: string = ''
    export let useCaching: boolean = true

    let hasMounted: boolean = false
    let basePath: string

    $: nft, basePath, setSource()

    let source: string | undefined = undefined
    function setSource(): void {
        if (features?.collectibles?.useCaching?.enabled && useCaching) {
            source = nft.downloadMetadata?.filePath
                ? `${basePath}/${nft.downloadMetadata?.filePath}/${NFT_MEDIA_FILE_NAME}`
                : undefined
        } else {
            source = nft.downloadMetadata?.downloadUrl
        }
    }

    onMount(async () => {
        if (process.env.NODE_ENV === 'development') {
            basePath = DEV_STORAGE_DIRECTORY
        } else {
            basePath = await getStorageDirectoryOfProfiles()
        }
        hasMounted = true
    })
</script>

{#if hasMounted && nft && isValidNftUri(nft.mediaUrl) && nft.metadata && source && (!useCaching || nft.isLoaded)}
    <MediaDisplay
        src={source}
        expectedType={nft.metadata.type}
        isLoaded={nft.isLoaded}
        {autoplay}
        {controls}
        {loop}
        {muted}
        {classes}
        alt={`Media display for ${nft.name}`}
    />
{:else}
    <slot name="placeholder" />
{/if}

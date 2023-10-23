<script lang="ts">
    import { TextColor } from '@bloomwalletio/ui'
    import { INft, NFT_MEDIA_FILE_NAME } from '@core/nfts'
    import { DEV_STORAGE_DIRECTORY } from '@core/profile/constants'
    import { getStorageDirectoryOfProfiles } from '@core/profile/utils'
    import features from '@features/features'
    import { MediaDisplay } from '@ui'
    import { onMount } from 'svelte'

    export let nft: INft
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let loop: boolean = false
    export let muted: boolean = false
    export let classes: string = ''
    export let useCaching: boolean = true
    export let showErrorColor: boolean = false

    let hasMounted: boolean = false
    let basePath: string

    $: src =
        features?.collectibles?.useCaching?.enabled && useCaching
            ? `${basePath}/${nft.filePath}/${NFT_MEDIA_FILE_NAME}`
            : nft.downloadUrl

    let placeHolderColor: TextColor = 'brand'
    $: nft, showErrorColor, (placeHolderColor = getPlaceHolderColor())

    function getPlaceHolderColor(): TextColor {
        if (!showErrorColor) {
            return 'brand'
        }

        if (nft.downloadMetadata.error) {
            return 'danger'
        } else if (nft.downloadMetadata.warning) {
            return 'warning'
        } else {
            return 'brand'
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
    <slot name="placeholder" />
{/if}

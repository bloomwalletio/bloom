<script lang="ts">
    import { Avatar, avatarSize } from '@bloomwalletio/ui'
    import { INft } from '@core/nfts'
    import { MediaPlaceholder, NftMedia } from '@ui'

    export let nft: INft
    export let size: (typeof avatarSize)[number]
    export let shape: 'circle' | 'squircle' | 'square' = 'square'

    $: nftType = nft?.parsedMetadata?.type
    $: parentType = nftType?.split('/')?.[0]
</script>

<nft-avatar class="avatar">
    <Avatar {size} {shape} {...$$restProps} backgroundColor="surface-2">
        {#if parentType === 'image'}
            <NftMedia {nft} classes="w-full h-full object-cover" smallIcon />
        {:else}
            <MediaPlaceholder type={nftType} smallIcon />
        {/if}
    </Avatar>
</nft-avatar>

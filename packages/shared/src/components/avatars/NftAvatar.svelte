<script lang="ts">
    import { Avatar, avatarSize } from '@bloomwalletio/ui'
    import { Nft } from '@core/nfts'
    import { MediaIcon, NftMedia } from '@ui'

    export let nft: Nft
    export let size: (typeof avatarSize)[number]
    export let shape: 'circle' | 'squircle' | 'square' = 'square'

    $: nftType = nft?.type
    $: parentType = nftType?.split('/')?.[0]
</script>

<nft-avatar class="avatar">
    <Avatar {size} {shape} {...$$restProps} surface={2}>
        {#if parentType === 'image'}
            <NftMedia {nft} classes="w-full h-full object-cover">
                <MediaIcon type={nftType} nftId={nft?.id} {size} surface={2} slot="placeholder" />
            </NftMedia>
        {:else}
            <MediaIcon type={nftType} nftId={nft?.id} {size} surface={2} />
        {/if}
    </Avatar>
</nft-avatar>

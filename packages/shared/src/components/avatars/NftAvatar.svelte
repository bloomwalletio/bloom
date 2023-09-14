<script lang="ts">
    import { Avatar, avatarSize } from '@bloomwalletio/ui'
    import { INft } from '@core/nfts'
    import { NftMedia } from '@ui'

    export let nft: INft
    export let size: (typeof avatarSize)[number]
    export let shape: 'circle' | 'squircle' | 'square' = 'square'
</script>

<nft-avatar>
    <Avatar {size} {shape} {...$$restProps}>
        <NftMedia {nft} classes="w-full h-full object-cover" />
    </Avatar>
</nft-avatar>

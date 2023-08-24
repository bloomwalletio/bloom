<script lang="ts">
    import { Avatar, avatarSize } from '@bloomwalletio/ui'
    import { INft } from '@core/nfts'
    import { NftMedia } from '@ui'

    export let nft: INft
    export let size: (typeof avatarSize)[number]
</script>

<nft-avatar>
    <Avatar {size}>
        <NftMedia {nft} classes="rounded-full object-cover" />
    </Avatar>
</nft-avatar>

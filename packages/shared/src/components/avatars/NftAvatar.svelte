<script lang="ts">
    import { Avatar } from '@bloomwalletio/ui'
    import { INft } from '@core/nfts'
    import { NftMedia } from '@ui'
    import { AvatarSize } from '@ui/enums'

    export let nft: INft
    export let size: AvatarSize
</script>

<nft-avatar>
    <Avatar {size}>
        <NftMedia {nft} classes="rounded-full object-cover" />
    </Avatar>
</nft-avatar>

<script lang="ts">
    import { onMount } from 'svelte'
    import { Avatar, NftMedia } from '@ui'
    import { AvatarSize } from '@ui/enums'
    import { INft } from '@core/nfts'

    export let nft: INft
    export let size: AvatarSize

    let height: number
    let width: number

    function setAvatarUiDetails(): void {
        switch (size) {
            case AvatarSize.ExtraLarge:
                height = 36
                width = 36
                break
            case AvatarSize.Large:
                height = 20
                width = 20
                break
            case AvatarSize.Medium:
                height = 10
                width = 10
                break
            case AvatarSize.Small:
                height = 8
                width = 8
                break
            case AvatarSize.ExtraSmall:
                height = 6
                width = 6
                break
            default:
                break
        }
    }

    onMount(() => {
        setAvatarUiDetails()
    })
</script>

<nft-avatar>
    <Avatar {size}>
        <div slot="content">
            <NftMedia {nft} classes="rounded-full object-cover h-{height} w-{width}" />
        </div>
    </Avatar>
</nft-avatar>

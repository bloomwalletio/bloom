<script lang="ts">
    import { NftAvatar } from '@ui'
    import { Text, Tile } from '@bloomwalletio/ui'
    import { INft } from '@core/nfts'
    import { truncateString } from '@core/utils'

    export let nft: INft
    export let onClick: (() => unknown) | undefined = undefined
    export let selected = false
    export let fullWidth = true
</script>

<Tile {selected} {onClick} surface={1}>
    <div class="w-full flex flex-row items-center text-left space-x-4">
        <NftAvatar {nft} size="lg" shape="square" />
        <div class="flex flex-col overflow-hidden">
            <Text truncate>
                {nft.name}
            </Text>
            <Text fontWeight="medium" textColor="secondary" truncate>
                {fullWidth ? nft.id : truncateString(nft.id, 7, 7)}
            </Text>
        </div>
    </div>
</Tile>

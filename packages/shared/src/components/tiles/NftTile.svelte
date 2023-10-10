<script lang="ts">
    import { ClickableTile, NftAvatar } from '@ui'
    import { Text } from '@bloomwalletio/ui'
    import { INft } from '@core/nfts'
    import { truncateString } from '@core/utils'

    export let nft: INft
    export let onClick: (() => unknown) | undefined = undefined
    export let selected = false
    export let fullWidth = true
    export let classes = ''
</script>

<ClickableTile
    {onClick}
    classes="border-2 border-solid {selected ? 'border-blue-500 dark:border-gray-500' : 'border-transparent'} {classes}"
    {...$$restProps}
>
    <div class="w-full flex flex-row items-center text-left space-x-4">
        <NftAvatar {nft} size="lg" shape="square" />
        <div class="flex flex-col overflow-hidden">
            <Text truncate>
                {nft.name}
            </Text>
            <Text fontWeight="medium" textColor="secondary" truncate>
                {fullWidth ? nft.address : truncateString(nft.address, 7, 7)}
            </Text>
        </div>
    </div>
</ClickableTile>

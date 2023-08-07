<script lang="ts">
    import { ClickableTile, Text, FontWeight, NftImageOrIconBox } from '@ui'
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
        <NftImageOrIconBox {nft} />
        <div class="flex flex-col gap-1 overflow-hidden">
            <Text classes="text-ellipsis overflow-hidden whitespace-nowrap" fontWeight={FontWeight.semibold}>
                {nft.name}
            </Text>
            <Text secondary classes="text-ellipsis overflow-hidden" smaller
                >{fullWidth ? nft.address : truncateString(nft.address, 7, 7)}</Text
            >
        </div>
    </div>
</ClickableTile>

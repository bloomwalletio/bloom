<script lang="ts">
    import { Tile, Text, Pill } from '@bloomwalletio/ui'
    import { TransakCryptoCurrency } from '@auxiliary/transak/stores'
    import TransakCryptoCurrencyAvatar from './TransakCryptoCurrencyAvatar.svelte'

    export let cryptoCurrency: TransakCryptoCurrency
    export let onClick: (() => unknown) | undefined = undefined
    export let selected = false
</script>

<Tile {onClick} {selected} surface={1} width="full">
    <div class="w-full flex items-center gap-2">
        <TransakCryptoCurrencyAvatar {cryptoCurrency} hideNetworkBadge />
        <div class="flex w-full justify-between items-center">
            <div class="flex flex-col">
                <Text>{cryptoCurrency.symbol}</Text>
                <Text fontWeight="medium">{cryptoCurrency.name}</Text>
            </div>
            <Pill color="brand" compact>
                <Text type="xs" textColor="brand" transform="uppercase">{cryptoCurrency.networkName}</Text>
            </Pill>
        </div>
    </div>
</Tile>

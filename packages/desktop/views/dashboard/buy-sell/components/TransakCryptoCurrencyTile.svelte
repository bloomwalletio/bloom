<script lang="ts">
    import { Icon, IconName, Tile, Text, Pill } from '@bloomwalletio/ui'
    import { TransakCryptoCurrency } from '@auxiliary/transak/stores'
    import TransakCryptoCurrencyAvatar from './TransakCryptoCurrencyAvatar.svelte'

    export let cryptoCurrency: TransakCryptoCurrency | undefined
    export let onClick: (() => unknown) | undefined = undefined
    export let selected = false
    export let variant: 'selector' | 'item' = 'item'
</script>

<Tile {onClick} {selected} surface={1} width="full" class={cryptoCurrency ? '' : 'animate-pulse'}>
    <div class="w-full flex items-center gap-2">
        <TransakCryptoCurrencyAvatar {cryptoCurrency} hideNetworkBadge />
        {#if variant === 'item'}
            <div class="flex w-full justify-between items-center">
                <div class="flex flex-col">
                    <Text>{cryptoCurrency?.symbol ?? '​'}</Text>
                    <Text fontWeight="medium">{cryptoCurrency?.name ?? '​'}</Text>
                </div>
                <Pill color="brand" compact>
                    <Text type="xs" textColor="brand" transform="uppercase">{cryptoCurrency?.network.name ?? '​'}</Text>
                </Pill>
            </div>
        {:else}
            <div class="flex w-full justify-between items-center">
                <div class="flex flex-col">
                    <Text>{cryptoCurrency?.symbol ?? '​'}</Text>
                    <Pill color="brand" compact>
                        <Text type="xs" textColor="brand" transform="uppercase"
                            >{cryptoCurrency?.network.name ?? '​'}</Text
                        >
                    </Pill>
                </div>
                <Icon name={IconName.ChevronDown} size="sm" />
            </div>
        {/if}
    </div>
</Tile>

<script lang="ts">
    import { Icon, IconName, Tile, Text, Pill } from '@bloomwalletio/ui'
    import { TransakCryptoCurrency } from '@auxiliary/transak/stores'
    import TransakCryptoCurrencyAvatar from './TransakCryptoCurrencyAvatar.svelte'
    import { NetworkId, SupportedNetworkId } from '@core/network'

    export let cryptoCurrency: TransakCryptoCurrency | undefined
    export let onClick: (() => unknown) | undefined = undefined
    export let selected = false
    export let variant: 'selector' | 'item' = 'item'

    const PILL_COLOR: { [id in NetworkId]: string } = {
        [SupportedNetworkId.Iota]: 'iota',
        [SupportedNetworkId.Shimmer]: 'shimmer',
        [SupportedNetworkId.Testnet]: 'shimmer',
        [SupportedNetworkId.IotaTestnet]: 'iota',
        [SupportedNetworkId.IotaEvm]: 'iota',
        [SupportedNetworkId.ShimmerEvm]: 'shimmer',
        [SupportedNetworkId.IotaTestnetEvm]: 'iota',
        [SupportedNetworkId.TestnetEvm]: 'shimmer',
        [SupportedNetworkId.Ethereum]: 'ethereum',
        [SupportedNetworkId.Sepolia]: 'ethereum',
        [SupportedNetworkId.GenericEvm]: 'ethereum',
    }
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
                <Pill color={PILL_COLOR[cryptoCurrency?.network?.id ?? SupportedNetworkId.GenericEvm]} compact>
                    <Text type="xs" textColor="current" transform="uppercase">
                        {cryptoCurrency?.network.name ?? '​'}
                    </Text>
                </Pill>
            </div>
        {:else}
            <div class="flex w-full justify-between items-center">
                <div class="flex flex-col">
                    <Text>{cryptoCurrency?.symbol ?? '​'}</Text>
                    <Pill color={PILL_COLOR[cryptoCurrency?.network?.id ?? SupportedNetworkId.GenericEvm]} compact>
                        <Text type="xs" textColor="current" transform="uppercase">
                            {cryptoCurrency?.network.name ?? '​'}
                        </Text>
                    </Pill>
                </div>
                <Icon name={IconName.ChevronDown} size="sm" />
            </div>
        {/if}
    </div>
</Tile>

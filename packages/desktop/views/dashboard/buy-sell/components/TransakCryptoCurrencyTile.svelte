<script lang="ts">
    import { Icon, IconName, Tile, Text, Pill } from '@bloomwalletio/ui'
    import { TransakCryptoCurrency } from '@auxiliary/transak/stores'
    import TransakCryptoCurrencyAvatar from './TransakCryptoCurrencyAvatar.svelte'
    import { NetworkId, SupportedNetworkId } from '@core/network'

    export let cryptoCurrency: TransakCryptoCurrency | undefined
    export let onClick: (() => unknown) | undefined = undefined
    export let selected = false
    export let variant: 'selector' | 'item' = 'item'

    const PILL_COLOR: { [id in NetworkId]?: string } = {
        [SupportedNetworkId.Iota]: 'neutral',
        [SupportedNetworkId.Shimmer]: 'neutral',
        [SupportedNetworkId.Testnet]: 'neutral',
        [SupportedNetworkId.IotaTestnet]: 'neutral',
        [SupportedNetworkId.IotaEvm]: 'neutral',
        [SupportedNetworkId.ShimmerEvm]: 'neutral',
        [SupportedNetworkId.IotaTestnetEvm]: 'neutral',
        [SupportedNetworkId.TestnetEvm]: 'neutral',
        [SupportedNetworkId.Ethereum]: 'neutral',
        [SupportedNetworkId.Sepolia]: 'neutral',
        [SupportedNetworkId.GenericEvm]: 'neutral',
    }

    const PILL_TEXT_COLOR: { [id in NetworkId]?: string } = {
        [SupportedNetworkId.Iota]: 'iota',
        [SupportedNetworkId.Shimmer]: 'shimmer',
        [SupportedNetworkId.Testnet]: 'text-secondary',
        [SupportedNetworkId.IotaTestnet]: 'text-secondary',
        [SupportedNetworkId.IotaEvm]: 'iota-evm',
        [SupportedNetworkId.ShimmerEvm]: 'shimmer-evm',
        [SupportedNetworkId.IotaTestnetEvm]: 'text-secondary',
        [SupportedNetworkId.TestnetEvm]: 'text-secondary',
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
                    <Text
                        type="xs"
                        customColor={PILL_TEXT_COLOR[cryptoCurrency?.network?.id ?? SupportedNetworkId.GenericEvm]}
                        transform="uppercase"
                    >
                        {cryptoCurrency?.network.name ?? '​'}
                    </Text>
                </Pill>
            </div>
        {:else}
            <div class="flex w-full justify-between items-center">
                <div class="flex flex-col">
                    <Text>{cryptoCurrency?.symbol ?? '​'}</Text>
                    <Pill color={PILL_COLOR[cryptoCurrency?.network?.id ?? SupportedNetworkId.GenericEvm]} compact>
                        <Text
                            type="xs"
                            customColor={PILL_TEXT_COLOR[cryptoCurrency?.network?.id ?? SupportedNetworkId.GenericEvm]}
                            transform="uppercase"
                        >
                            {cryptoCurrency?.network.name ?? '​'}
                        </Text>
                    </Pill>
                </div>
                <Icon name={IconName.ChevronDown} size="sm" />
            </div>
        {/if}
    </div>
</Tile>

<script lang="ts">
    import { Pill, Text } from '@bloomwalletio/ui'
    import { NetworkId, SupportedNetworkId, getNameFromNetworkId } from '@core/network'

    export let networkId: NetworkId | undefined
    export let networkName: string | undefined = undefined
    export let compact: boolean = false

    const PILL_COLOR: { [id in NetworkId]?: string } = {
        [SupportedNetworkId.Iota]: 'iota-background',
        [SupportedNetworkId.Shimmer]: 'shimmer',
        [SupportedNetworkId.Testnet]: 'text-secondary',
        [SupportedNetworkId.IotaTestnet]: 'text-secondary',
        [SupportedNetworkId.IotaEvm]: 'iota-evm-background',
        [SupportedNetworkId.ShimmerEvm]: 'shimmer-evm-background',
        [SupportedNetworkId.IotaTestnetEvm]: 'iota-evm-background/90',
        [SupportedNetworkId.TestnetEvm]: 'shimmer-evm-background/90',
        [SupportedNetworkId.Ethereum]: 'ethereum',
        [SupportedNetworkId.Sepolia]: 'text-secondary',
        [SupportedNetworkId.GenericEvm]: 'text-secondary',
    }

    $: networkName = networkName ? networkName : networkId ? getNameFromNetworkId(networkId) ?? networkId : networkId
</script>

<Pill color={PILL_COLOR[networkId ?? SupportedNetworkId.GenericEvm]} {compact}>
    <Text type="xs" textColor="current" transform="uppercase">
        {networkName ?? '​'}
    </Text>
</Pill>

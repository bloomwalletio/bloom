<script lang="ts">
    import { DEFAULT_NETWORK_ICON } from '@auxiliary/icon'
    import { Avatar, IconName, Tooltip } from '@bloomwalletio/ui'
    import { NetworkId, SupportedNetworkId, getNameFromNetworkId } from '@core/network'

    export let networkId: NetworkId
    export let networkName: string | undefined = undefined
    export let showTooltip: boolean = false
    export let size: 'xxs' | 'xs' | 'sm' | 'base' | 'md' = 'base'
    export let shape: 'circle' | 'square' | 'squircle' = 'circle'

    const AVATAR_BACKGROUND_COLOR: { [id in NetworkId]?: string } = {
        [SupportedNetworkId.Iota]: 'iota-background',
        [SupportedNetworkId.Shimmer]: 'shimmer-background',
        [SupportedNetworkId.Testnet]: 'text-secondary',
        [SupportedNetworkId.IotaTestnet]: 'text-secondary',
        [SupportedNetworkId.IotaEvm]: 'iota-evm-background',
        [SupportedNetworkId.ShimmerEvm]: 'shimmer-evm-background',
        [SupportedNetworkId.IotaTestnetEvm]: 'iota-evm-background/90',
        [SupportedNetworkId.TestnetEvm]: 'shimmer-evm-background/90',
        [SupportedNetworkId.Ethereum]: '#627eea',
        [SupportedNetworkId.Sepolia]: 'text-secondary',
        [SupportedNetworkId.GenericEvm]: '#627eea',
    }

    const AVATAR_TEXT_COLOR: { [id in NetworkId]?: string } = {
        [SupportedNetworkId.Iota]: 'iota',
        [SupportedNetworkId.Shimmer]: 'shimmer',
        [SupportedNetworkId.IotaTestnet]: '#FFFFFF',
        [SupportedNetworkId.Testnet]: '#FFFFFF',
        [SupportedNetworkId.IotaEvm]: 'iota-evm',
        [SupportedNetworkId.ShimmerEvm]: 'shimmer-evm',
        [SupportedNetworkId.IotaTestnetEvm]: '#FFFFFF',
        [SupportedNetworkId.TestnetEvm]: '#FFFFFF',
        [SupportedNetworkId.Ethereum]: '#FFFFFF',
        [SupportedNetworkId.Sepolia]: '#FFFFFF',
        [SupportedNetworkId.GenericEvm]: '#FFFFFF',
    }

    let anchor: HTMLElement
    $: networkName = networkName ? networkName : networkId ? getNameFromNetworkId(networkId) ?? networkId : networkId
    $: magnify = Object.values(SupportedNetworkId).includes(networkId)
</script>

<network-avatar bind:this={anchor} class="avatar">
    <Avatar
        {size}
        {shape}
        backgroundColor={AVATAR_BACKGROUND_COLOR[networkId] ?? 'neutral-4'}
        customTextColor={AVATAR_TEXT_COLOR[networkId] ?? 'text-primary'}
        icon={DEFAULT_NETWORK_ICON[networkId] ?? IconName.Globe}
        {magnify}
    />
</network-avatar>
{#if showTooltip && networkName}
    <Tooltip {anchor} text={networkName} placement="right" event="hover" />
{/if}

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
        [SupportedNetworkId.Testnet]: 'shimmer-background',
        [SupportedNetworkId.IotaEvm]: 'iota-evm-background',
        [SupportedNetworkId.ShimmerEvm]: 'shimmer-evm-background',
        [SupportedNetworkId.TestnetEvm]: 'shimmer-evm-background',
    }

    const AVATAR_TEXT_COLOR: { [id in NetworkId]?: string } = {
        [SupportedNetworkId.Iota]: 'iota',
        [SupportedNetworkId.Shimmer]: 'shimmer',
        [SupportedNetworkId.Testnet]: 'shimmer',
        [SupportedNetworkId.IotaEvm]: 'iota-evm',
        [SupportedNetworkId.ShimmerEvm]: 'shimmer-evm',
        [SupportedNetworkId.TestnetEvm]: 'shimmer-evm',
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

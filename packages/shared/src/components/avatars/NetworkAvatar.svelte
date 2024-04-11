<script lang="ts">
    import { DEFAULT_NETWORK_ICON } from '@auxiliary/icon'
    import { Avatar, Tooltip } from '@bloomwalletio/ui'
    import { NetworkId, SupportedNetworkId, getNameFromNetworkId, isSupportedNetworkId } from '@core/network'

    export let networkId: NetworkId
    export let networkName: string | undefined = undefined
    export let showTooltip: boolean = false
    export let size: 'xxs' | 'xs' | 'sm' | 'base' | 'md' = 'base'
    export let shape: 'circle' | 'square' | 'squircle' = 'circle'

    const AVATAR_BACKGROUND_COLOR: { [id in NetworkId]?: string } = {
        [SupportedNetworkId.Iota]: '#000000',
        [SupportedNetworkId.Shimmer]: 'shimmer-background',
        [SupportedNetworkId.Testnet]: 'shimmer-background',
        [SupportedNetworkId.ShimmerEvm]: 'shimmer-background',
        [SupportedNetworkId.TestnetEvm]: 'text-secondary',
    }

    const AVATAR_TEXT_COLOR: { [id in NetworkId]?: string } = {
        [SupportedNetworkId.Iota]: '#FFFFFF',
        [SupportedNetworkId.Shimmer]: 'shimmer',
        [SupportedNetworkId.Testnet]: 'text-secondary',
        [SupportedNetworkId.ShimmerEvm]: 'text-invert',
        [SupportedNetworkId.TestnetEvm]: 'shimmer-background',
    }

    let anchor: HTMLElement
    $: isSupported = isSupportedNetworkId(networkId)
    $: backgroundColor = isSupported ? AVATAR_BACKGROUND_COLOR[networkId] : 'neutral-4'
    $: customTextColor = isSupported ? AVATAR_TEXT_COLOR[networkId] : undefined
    $: icon = isSupported ? DEFAULT_NETWORK_ICON[networkId] : undefined
    $: networkName = networkName ? networkName : networkId ? getNameFromNetworkId(networkId) ?? networkId : networkId
    $: magnify = Object.values(SupportedNetworkId).includes(networkId)
</script>

<!-- TODO: Add initials for not supported network IDs -->
<network-avatar bind:this={anchor} class="avatar">
    <Avatar {size} {shape} {backgroundColor} {customTextColor} {icon} {magnify} />
</network-avatar>
{#if showTooltip && networkName}
    <Tooltip {anchor} text={networkName} placement="right" event="hover" />
{/if}

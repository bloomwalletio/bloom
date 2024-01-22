<script lang="ts">
    import { DEFAULT_NETWORK_ICON } from '@auxiliary/icon'
    import { Avatar } from '@bloomwalletio/ui'
    import { NetworkId, SupportedNetworkId, isSupportedNetworkId } from '@core/network'

    export let networkId: NetworkId
    export let size: 'xxs' | 'xs' | 'sm' | 'base' | 'md' = 'base'
    export let shape: 'circle' | 'square' | 'squircle' = 'circle'

    const AVATAR_BACKGROUND_COLOR: { [id in SupportedNetworkId]: string } = {
        [SupportedNetworkId.Iota]: '#000000',
        [SupportedNetworkId.Shimmer]: 'shimmer-background',
        [SupportedNetworkId.Testnet]: 'shimmer-background',
        [SupportedNetworkId.ShimmerEvm]: 'shimmer-background',
        [SupportedNetworkId.TestnetEvm]: 'text-secondary',
    }

    const AVATAR_TEXT_COLOR: { [id in SupportedNetworkId]: string } = {
        [SupportedNetworkId.Iota]: '#FFFFFF',
        [SupportedNetworkId.Shimmer]: 'shimmer',
        [SupportedNetworkId.Testnet]: 'text-secondary',
        [SupportedNetworkId.ShimmerEvm]: 'text-invert',
        [SupportedNetworkId.TestnetEvm]: 'shimmer-background',
    }

    $: isSupported = isSupportedNetworkId(networkId)
    $: backgroundColor = isSupported ? AVATAR_BACKGROUND_COLOR[networkId as SupportedNetworkId] : 'neutral-4'
    $: customTextColor = isSupported ? AVATAR_TEXT_COLOR[networkId as SupportedNetworkId] : undefined
    $: icon = isSupported ? DEFAULT_NETWORK_ICON[networkId as SupportedNetworkId] : undefined
    $: magnify = networkId === SupportedNetworkId.ShimmerEvm || networkId === SupportedNetworkId.TestnetEvm
</script>

<!-- TODO: Add initials for not supported network IDs -->
<Avatar {size} {shape} {backgroundColor} {customTextColor} {icon} />

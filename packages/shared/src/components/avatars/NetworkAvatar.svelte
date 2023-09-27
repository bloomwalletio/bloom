<script lang="ts">
    import { DEFAULT_NETWORK_ICON } from '@auxiliary/icon'
    import { Avatar } from '@bloomwalletio/ui'
    import { NetworkId, SupportedNetworkId, isSupportedNetworkId } from '@core/network'

    export let networkId: NetworkId
    export let size: 'xxs'   | 'xs' | 'sm' | 'md' = 'base'

    const AVATAR_BACKGROUND_COLOR: { [id in SupportedNetworkId]: string } = {
        [SupportedNetworkId.Shimmer]: 'shimmer-background',
        [SupportedNetworkId.Testnet]: 'shimmer-background',
        [SupportedNetworkId.ShimmerEvm]: 'shimmer-background',
        [SupportedNetworkId.ShimmerEvmTestnet]: 'shimmer-background',
    }

    const AVATAR_TEXT_COLOR: { [id in SupportedNetworkId]: string } = {
        [SupportedNetworkId.Shimmer]: 'shimmer',
        [SupportedNetworkId.Testnet]: 'text-secondary',
        [SupportedNetworkId.ShimmerEvm]: 'shimmer',
        [SupportedNetworkId.ShimmerEvmTestnet]: 'text-secondary',
    }

    $: isSupported = isSupportedNetworkId(networkId)
    $: backgroundColor = isSupported ? AVATAR_BACKGROUND_COLOR[networkId as SupportedNetworkId] : 'neutral-4'
    $: customTextColor = isSupported ? AVATAR_TEXT_COLOR[networkId as SupportedNetworkId] : undefined
    $: icon = isSupported ? DEFAULT_NETWORK_ICON[networkId as SupportedNetworkId] : undefined
    $: magnify = networkId === SupportedNetworkId.ShimmerEvm || networkId === SupportedNetworkId.ShimmerEvmTestnet
</script>

<!-- TODO: Add initials for not supported network IDs -->
<Avatar {size} {backgroundColor} {customTextColor} {icon} {magnify} />

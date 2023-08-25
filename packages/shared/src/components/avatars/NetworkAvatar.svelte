<script lang="ts">
    import { NETWORK_ICON_SVG } from '@auxiliary/icon'
    import { Avatar } from '@bloomwalletio/ui'
    import { NetworkId, SupportedNetworkId, isSupportedNetworkId } from '@core/network'

    export let networkId: NetworkId
    export let size: 'xxs' | 'xs' | 'sm' = 'sm'

    const AVATAR_TEXT_COLOR: { [id in SupportedNetworkId]: string } = {
        [SupportedNetworkId.Shimmer]: '#17E1D5',
        [SupportedNetworkId.Testnet]: 'gray-400',
        [SupportedNetworkId.ShimmerEvm]: '#17E1D5',
        [SupportedNetworkId.ShimmerEvmTestnet]: 'gray-400',
    }

    const AVATAR_BACKGROUND_COLOR: { [id in SupportedNetworkId]: string } = {
        [SupportedNetworkId.Shimmer]: '#020F26',
        [SupportedNetworkId.Testnet]: '#020F26',
        [SupportedNetworkId.ShimmerEvm]: '#020F26',
        [SupportedNetworkId.ShimmerEvmTestnet]: '#020F26',
    }

    $: isSupported = isSupportedNetworkId(networkId)
    $: backgroundColor = isSupported ? AVATAR_BACKGROUND_COLOR[networkId as SupportedNetworkId] : 'gray-100'
    $: textColor = isSupported ? AVATAR_TEXT_COLOR[networkId as SupportedNetworkId] : 'gray-400'
    $: icon = isSupported ? NETWORK_ICON_SVG[networkId as SupportedNetworkId] : undefined
</script>

<!-- TODO: Add initials for not supported network IDs -->
<Avatar {size} {backgroundColor} {textColor} {icon} />

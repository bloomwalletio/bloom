<script lang="ts">
    import { DEFAULT_TOKEN_ICON } from '@auxiliary/icon'
    import { Avatar } from '@bloomwalletio/ui'
    import { getIconColorFromString } from '@core/account'
    import { SupportedNetworkId } from '@core/network'
    import { IToken, getTokenInitials } from '@core/token'
    import { NetworkBadge } from '@ui/badges'

    export let token: IToken
    export let size: 'xxs' | 'xs' | 'sm' = 'sm'
    export let hideNetworkBadge: boolean = false

    const AVATAR_BACKGROUND_COLOR: { [networkId: string]: { [tokenId: string]: string } } = {
        [SupportedNetworkId.Shimmer]: {
            '4219': '#17E1D5',
        },
        [SupportedNetworkId.Testnet]: {
            '1': '#17E1D5',
        },
        [SupportedNetworkId.ShimmerEvm]: {
            '1': '#17E1D5',
        },
        [SupportedNetworkId.ShimmerEvmTestnet]: {
            '1': '#17E1D5',
        },
    }

    const AVATAR_TEXT_COLOR: { [networkId: string]: { [tokenId: string]: string } } = {
        [SupportedNetworkId.Shimmer]: {
            '4219': '#020F26',
        },
        [SupportedNetworkId.Testnet]: {
            '1': '#020F26',
        },
        [SupportedNetworkId.ShimmerEvm]: {
            '1': '#020F26',
        },
        [SupportedNetworkId.ShimmerEvmTestnet]: {
            '1': '#020F26',
        },
    }

    $: backgroundColor =
        AVATAR_BACKGROUND_COLOR[token.networkId]?.[token.id] ??
        getIconColorFromString(token.metadata?.name, {
            shades: ['400', '500', '600', '700', '800'],
            colorsToExclude: ['gray'],
        })
    $: textColor = AVATAR_TEXT_COLOR[token.networkId]?.[token.id]
    $: icon = DEFAULT_TOKEN_ICON[token.networkId as SupportedNetworkId]?.[token.id]
    $: text = getTokenInitials(token)
</script>

<div>
    <Avatar {size} {backgroundColor} {icon} {textColor} text={icon ? undefined : text} />
    {#if size === 'sm' && !hideNetworkBadge}
        <span class="relative flex justify-center items-center bottom-0 right-0">
            <NetworkBadge size="xxs" networkId={token.networkId} />
        </span>
    {/if}
</div>

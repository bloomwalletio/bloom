<script lang="ts">
    import { DEFAULT_TOKEN_ICON } from '@auxiliary/icon'
    import { Avatar } from '@bloomwalletio/ui'
    import { getIconColorFromString } from '@core/account'
    import { SupportedNetworkId } from '@core/network'
    import { IToken, getTokenInitials } from '@core/token'
    import { BASE_TOKEN_ID } from '@core/token/constants'
    import { NetworkBadge } from '@ui/badges'

    export let token: IToken
    export let size: 'xxs' | 'xs' | 'sm' | 'md' = 'sm'
    export let hideNetworkBadge: boolean = false

    const AVATAR_BACKGROUND_COLOR: { [networkId: string]: { [tokenId: string]: string } } = {
        [SupportedNetworkId.Shimmer]: {
            [BASE_TOKEN_ID]: '#17E1D5',
        },
        [SupportedNetworkId.Testnet]: {
            [BASE_TOKEN_ID]: '#17E1D5',
        },
        [SupportedNetworkId.ShimmerEvm]: {
            [BASE_TOKEN_ID]: '#17E1D5',
        },
        [SupportedNetworkId.ShimmerEvmTestnet]: {
            [BASE_TOKEN_ID]: '#17E1D5',
        },
    }

    const AVATAR_TEXT_COLOR: { [networkId: string]: { [tokenId: string]: string } } = {
        [SupportedNetworkId.Shimmer]: {
            [BASE_TOKEN_ID]: '#020F26',
        },
        [SupportedNetworkId.Testnet]: {
            [BASE_TOKEN_ID]: '#020F26',
        },
        [SupportedNetworkId.ShimmerEvm]: {
            [BASE_TOKEN_ID]: '#020F26',
        },
        [SupportedNetworkId.ShimmerEvmTestnet]: {
            [BASE_TOKEN_ID]: '#020F26',
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
    {#if (size === 'sm' || size === 'md') && !hideNetworkBadge}
        <span class="relative flex justify-center items-center bottom-0 right-0">
            <NetworkBadge size="xxs" networkId={token.networkId} />
        </span>
    {/if}
</div>

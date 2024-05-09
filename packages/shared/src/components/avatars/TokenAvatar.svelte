<script lang="ts">
    import { DEFAULT_TOKEN_ICON } from '@auxiliary/icon'
    import { Avatar } from '@bloomwalletio/ui'
    import { getIconColorFromString } from '@core/account'
    import { CoinGeckoCoinImage } from '@core/market/interfaces'
    import { getImageUrlFromToken } from '@core/market/utils/getImageUrlFromToken'
    import { SupportedNetworkId } from '@core/network'
    import { IToken, getTokenInitials } from '@core/token'
    import { BASE_TOKEN_ID } from '@core/token/constants'
    import { NetworkBadge } from '@ui/badges'

    export let token: IToken
    export let size: 'xxs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' = 'md'
    export let hideNetworkBadge: boolean = false

    const AVATAR_BACKGROUND_COLOR: { [networkId: string]: { [tokenId: string]: string } } = {
        [SupportedNetworkId.Iota]: {
            [BASE_TOKEN_ID]: '#000000',
        },
        [SupportedNetworkId.Shimmer]: {
            [BASE_TOKEN_ID]: 'shimmer',
        },
        [SupportedNetworkId.IotaTestnet]: {
            [BASE_TOKEN_ID]: '#000000',
        },
        [SupportedNetworkId.Testnet]: {
            [BASE_TOKEN_ID]: 'shimmer',
        },
        [SupportedNetworkId.IotaEvm]: {
            [BASE_TOKEN_ID]: '#000000',
        },
        [SupportedNetworkId.ShimmerEvm]: {
            [BASE_TOKEN_ID]: 'shimmer',
        },
        [SupportedNetworkId.TestnetEvm]: {
            [BASE_TOKEN_ID]: 'shimmer',
        },
    }

    const AVATAR_TEXT_COLOR: { [networkId: string]: { [tokenId: string]: string } } = {
        [SupportedNetworkId.Iota]: {
            [BASE_TOKEN_ID]: '#FFFFFF',
        },
        [SupportedNetworkId.Shimmer]: {
            [BASE_TOKEN_ID]: 'shimmer-background',
        },
        [SupportedNetworkId.IotaTestnet]: {
            [BASE_TOKEN_ID]: '#FFFFFF',
        },
        [SupportedNetworkId.Testnet]: {
            [BASE_TOKEN_ID]: 'shimmer-background',
        },
        [SupportedNetworkId.IotaEvm]: {
            [BASE_TOKEN_ID]: '#FFFFFF',
        },
        [SupportedNetworkId.ShimmerEvm]: {
            [BASE_TOKEN_ID]: 'shimmer-background',
        },
        [SupportedNetworkId.TestnetEvm]: {
            [BASE_TOKEN_ID]: 'shimmer-background',
        },
    }

    const IMAGE_SIZES: Record<typeof size, keyof CoinGeckoCoinImage> = {
        xxs: 'thumb',
        xs: 'thumb',
        sm: 'thumb',
        base: 'small',
        md: 'small',
        lg: 'small',
    }

    let imageLoadError = false

    $: backgroundColor =
        AVATAR_BACKGROUND_COLOR[token.networkId]?.[token?.id] ??
        getIconColorFromString(token.metadata?.name, {
            shades: ['400', '500', '600', '700', '800'],
            colorsToExclude: ['gray'],
        })
    $: textColor = AVATAR_TEXT_COLOR[token.networkId]?.[token?.id]
    $: icon = DEFAULT_TOKEN_ICON[token.networkId]?.[token?.id]
    $: image = getImageUrlFromToken(token, IMAGE_SIZES[size])
    $: text = getTokenInitials(token)
    $: magnify = token.id === BASE_TOKEN_ID && Object.values(SupportedNetworkId).includes(token.networkId)
</script>

<div class="avatar">
    <Avatar
        {size}
        {backgroundColor}
        {icon}
        customTextColor={textColor}
        text={icon || (image && !imageLoadError) ? '' : text}
        {magnify}
    >
        {#if image && !imageLoadError}
            <img
                src={image}
                alt={token.metadata?.name}
                class="w-full h-full object-cover"
                on:error={() => (imageLoadError = true)}
            />
        {/if}
    </Avatar>
    {#if (size === 'base' || size === 'md' || size === 'lg') && !hideNetworkBadge}
        <span class="relative flex justify-center items-center bottom-0 right-0">
            <NetworkBadge size="xs" networkId={token.networkId} />
        </span>
    {/if}
</div>

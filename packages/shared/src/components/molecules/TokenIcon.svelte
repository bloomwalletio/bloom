<script lang="ts">
    import { Icon as IconEnum, NETWORK_ICON_SVG } from '@auxiliary/icon'
    import { getIconColorFromString } from '@core/account'
    import { COIN_TYPE, network, SupportedNetworkId } from '@core/network'
    import { activeProfile } from '@core/profile/stores'
    import { isBright } from '@core/utils'
    import { ANIMATED_TOKEN_IDS, getTokenInitials, IPersistedToken, TokenStandard } from '@core/token'
    import { Animation, Icon, NetworkIconBadge, VerificationBadge } from '@ui'

    export let token: IPersistedToken
    export let chainId: number | undefined
    export let large = false
    export let small = false

    let icon: IconEnum | null
    let tokenIconColor: string
    let tokenIconBackgroundColor: string
    let tokenInitials: string
    let tokenIconWrapperWidth: number
    let tokenLogoUrl: string
    let chainName: string | undefined

    $: $network, chainId, (chainName = getTooltipText())
    $: isAnimation = token.id in ANIMATED_TOKEN_IDS
    $: baseNetworkId = $activeProfile?.network?.id ?? ''

    $: {
        switch (token.id) {
            case String(COIN_TYPE[baseNetworkId]): {
                const isIotaNetwork = baseNetworkId === SupportedNetworkId.Iota
                tokenInitials = ''
                tokenIconBackgroundColor = isIotaNetwork ? '#6E82A4' : '#25DFCA'
                tokenIconColor = isBright(tokenIconBackgroundColor) ? 'gray-800' : 'white'
                icon = NETWORK_ICON_SVG[baseNetworkId]
                break
            }
            default:
                tokenInitials = getTokenInitials(token)
                tokenIconBackgroundColor = getIconColorFromString(token.metadata?.name, {
                    shades: ['500', '600', '700', '800'],
                    colorsToExclude: ['gray'],
                })
                tokenIconColor = isBright(tokenIconBackgroundColor) ? 'gray-800' : 'white'
                tokenLogoUrl = token.metadata?.standard === TokenStandard.Irc30 ? token.metadata?.logoUrl ?? '' : ''
                icon = null
        }
    }

    function getTooltipText(): string | undefined {
        const networkName = $network?.getMetadata().name
        if (chainId) {
            const chain = $network?.getChain(chainId)
            return chain?.getConfiguration().name ?? networkName
        } else {
            return networkName
        }
    }
</script>

<div
    class="
        relative flex
        {large ? 'w-12 h-12' : small ? 'w-6 h-6' : 'w-8 h-8'}
    "
>
    <div
        class="
        rounded-full flex justify-center items-center transition-none
        {isAnimation ? 'p-0' : 'p-1'}
        {large ? 'w-12 h-12' : small ? 'w-6 h-6' : 'w-8 h-8'}
        {tokenIconBackgroundColor ? 'icon-bg' : 'bg-blue-500'}
    "
        style={tokenIconBackgroundColor ? `--icon-bg-color: ${tokenIconBackgroundColor}` : ''}
        bind:clientWidth={tokenIconWrapperWidth}
    >
        {#if isAnimation}
            <Animation
                classes={large ? 'w-12 h-12' : small ? 'w-6 h-6' : 'w-8 h-8'}
                animation={ANIMATED_TOKEN_IDS[token.id]}
                loop={true}
                renderer="canvas"
            />
        {:else if icon}
            <Icon {icon} width="80%" height="80%" classes="text-{tokenIconColor ?? 'blue-500'} text-center" />
        {:else if tokenLogoUrl}
            <img src={tokenLogoUrl} on:error={() => (tokenLogoUrl = '')} alt="" class="w-full h-full" />
        {:else}
            <p
                style={`font-size: ${Math.floor(
                    Math.min(large ? 20 : 12, tokenIconWrapperWidth / tokenInitials?.length)
                )}px;`}
                class="transition-none font-600 text-{tokenIconColor ?? 'blue-500'} text-center"
            >
                {tokenInitials?.toUpperCase() ?? '-'}
            </p>
        {/if}
    </div>
    <span class="absolute flex justify-center items-center bottom-0 right-0">
        {#if token.verification.verified === true}
            <NetworkIconBadge
                width={10}
                height={10}
                networkId={$activeProfile.network.id}
                {chainId}
                tooltipText={chainName}
            />
        {:else}
            <VerificationBadge status={token.verification?.status} width={14} height={14} />
        {/if}
    </span>
</div>

<style lang="scss">
    .icon-bg {
        background-color: var(--icon-bg-color);
    }
</style>

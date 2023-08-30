<script lang="ts">
    import { Icon as IconEnum, NETWORK_ICON_SVG } from '@auxiliary/icon'
    import { getIconColorFromString } from '@core/account'
    import { DEFAULT_COIN_TYPE, NetworkId } from '@core/network'
    import { activeProfile } from '@core/profile/stores'
    import { ANIMATED_TOKEN_IDS, IPersistedToken, TokenStandard, getTokenInitials } from '@core/token'
    import { isBright } from '@core/utils'
    import { Animation, Icon, NetworkBadge } from '@ui'

    export let persistedToken: IPersistedToken
    export let networkId: NetworkId | undefined
    export let large = false
    export let small = false

    let iconWrapperWidth: number
    let iconInfo:
        | {
              icon?: IconEnum
              iconColor: string
              iconBackgroundColor: string
              initials: string
              logoUrl?: string
          }
        | undefined
    let networkName: string | undefined

    $: isAnimation = persistedToken.id in ANIMATED_TOKEN_IDS
    $: baseNetworkId = $activeProfile?.network?.id ?? ''

    $: {
        switch (persistedToken.id) {
            case String(DEFAULT_COIN_TYPE[baseNetworkId]): {
                const isIotaNetwork = false
                const backgroundColor = isIotaNetwork ? '#6E82A4' : '#25DFCA'

                iconInfo = {
                    initials: '',
                    iconBackgroundColor: backgroundColor,
                    iconColor: isBright(backgroundColor) ? 'gray-800' : 'white',
                    icon: NETWORK_ICON_SVG[baseNetworkId],
                }
                break
            }
            default: {
                const backgroundColor = getIconColorFromString(persistedToken.metadata?.name, {
                    shades: ['500', '600', '700', '800'],
                    colorsToExclude: ['gray'],
                })

                iconInfo = {
                    initials: getTokenInitials(persistedToken),
                    iconBackgroundColor: backgroundColor,
                    iconColor: isBright(backgroundColor) ? 'gray-800' : 'white',
                    logoUrl:
                        persistedToken.metadata?.standard === TokenStandard.Irc30
                            ? persistedToken.metadata?.logoUrl ?? ''
                            : '',
                }
            }
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
        {iconInfo?.iconBackgroundColor ? 'icon-bg' : 'bg-blue-500'}
    "
        style={iconInfo?.iconBackgroundColor ? `--icon-bg-color: ${iconInfo?.iconBackgroundColor}` : ''}
        bind:clientWidth={iconWrapperWidth}
    >
        {#if isAnimation}
            <Animation
                classes={large ? 'w-12 h-12' : small ? 'w-6 h-6' : 'w-8 h-8'}
                animation={ANIMATED_TOKEN_IDS[persistedToken.id]}
                loop={true}
                renderer="canvas"
            />
        {:else if iconInfo?.icon}
            <Icon
                icon={iconInfo.icon}
                width="80%"
                height="80%"
                classes="text-{iconInfo.iconColor ?? 'blue-500'} text-center"
            />
        {:else if iconInfo?.logoUrl}
            <img
                src={iconInfo.logoUrl}
                on:error={() => {
                    if (iconInfo) iconInfo.logoUrl = ''
                }}
                alt=""
                class="w-full h-full"
            />
        {:else if iconInfo}
            <p
                style={`font-size: ${Math.floor(
                    Math.min(large ? 20 : 12, iconWrapperWidth / iconInfo?.initials?.length)
                )}px;`}
                class="transition-none font-600 text-{iconInfo?.iconColor ?? 'blue-500'} text-center"
            >
                {iconInfo.initials?.toUpperCase() ?? '-'}
            </p>
        {/if}
    </div>
    <span class="absolute flex justify-center items-center bottom-0 right-0">
        <NetworkBadge size="xxs" {networkId} tooltipText={networkName} />
    </span>
</div>

<style lang="scss">
    .icon-bg {
        background-color: var(--icon-bg-color);
    }
</style>

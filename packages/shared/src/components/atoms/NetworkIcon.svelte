<script lang="ts">
    import { Icon } from '@ui'
    import { NETWORK_ICON_SVG } from '@auxiliary/icon'
    import { ChainId, NetworkId } from '@core/network'

    export let networkId: NetworkId
    export let chainId: ChainId | undefined = undefined
    export let height = 22
    export let width = 22
    export let outlined = true

    $: backgroundColor = classesMap[networkId]?.backgroundColor ?? ''
    $: iconColor = classesMap[networkId]?.iconColor ?? ''

    const classesMap: { [key in NetworkId]?: Record<string, string> } = {
        [NetworkId.Iota]: {
            backgroundColor: 'bg-black',
            iconColor: 'text-white',
        },
        [NetworkId.Shimmer]: {
            backgroundColor: 'bg-shimmer-highlight',
            iconColor: 'text-black',
        },
        [NetworkId.Testnet]: {
            backgroundColor: 'bg-gray-400',
            iconColor: 'text-black',
        },
    }
</script>

<network-icon class={backgroundColor} class:outlined>
    <Icon {height} {width} icon={NETWORK_ICON_SVG[chainId || networkId]} classes={iconColor} />
</network-icon>

<style lang="scss">
    network-icon {
        @apply flex items-center justify-center p-0.5 rounded-full;
        &.outlined {
            @apply ring-2 ring-white dark:ring-gray-900;
        }
    }
</style>

<script lang="ts">
    import { Icon } from '@ui'
    import { NETWORK_ICON_SVG } from '@auxiliary/icon'
    import { buildTangleNetworkId, EvmChainId, NetworkIdType, TangleNetworkId } from '@core/network'

    export let networkId: NetworkIdType
    export let chainId: EvmChainId | undefined = undefined
    export let height = 22
    export let width = 22
    export let outlined = true

    $: backgroundColor = classesMap[networkId]?.backgroundColor ?? ''
    $: iconColor = classesMap[networkId]?.iconColor ?? ''

    const classesMap: { [id: NetworkIdType]: Record<string, string> } = {
        [buildTangleNetworkId(TangleNetworkId.Iota)]: {
            backgroundColor: 'bg-black',
            iconColor: 'text-white',
        },
        [buildTangleNetworkId(TangleNetworkId.Shimmer)]: {
            backgroundColor: 'bg-shimmer-highlight',
            iconColor: 'text-black',
        },
        [buildTangleNetworkId(TangleNetworkId.Testnet)]: {
            backgroundColor: 'bg-gray-400',
            iconColor: 'text-black',
        },
    }
</script>

<network-icon class={backgroundColor} class:outlined>
    <Icon {height} {width} icon={NETWORK_ICON_SVG[networkId]} classes={iconColor} />
</network-icon>

<style lang="scss">
    network-icon {
        @apply flex items-center justify-center p-0.5 rounded-full;
        &.outlined {
            @apply ring-2 ring-white dark:ring-gray-900;
        }
    }
</style>

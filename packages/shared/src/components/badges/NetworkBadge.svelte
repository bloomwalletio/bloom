<script lang="ts">
    import { NetworkId, getNameFromNetworkId } from '@core/network'
    import { NetworkAvatar, InformationTooltip } from '@ui'
    import { Position } from '@ui/enums'

    export let networkId: NetworkId
    export let networkName: string | undefined = undefined
    export let size: 'xxs' | 'xs' | 'sm' = 'sm'

    $: networkName = networkName ? networkName : networkId ? getNameFromNetworkId(networkId) : undefined

    let tooltipAnchor: HTMLElement
    let isTooltipVisible = false

    function showTooltip(show: boolean): void {
        isTooltipVisible = show
    }
</script>

<network-icon-badge
    bind:this={tooltipAnchor}
    on:mouseenter={() => showTooltip(true)}
    on:mouseleave={() => showTooltip(false)}
    on:wheel={() => showTooltip(false)}
    class="block absolute -right-1 -bottom-1 rounded-full bg-white dark:bg-gray-900 p-0.5"
>
    <NetworkAvatar {size} {networkId} />
</network-icon-badge>
{#if isTooltipVisible && networkName}
    <InformationTooltip anchor={tooltipAnchor} size="small" position={Position.Right} offset={6} body={networkName} />
{/if}

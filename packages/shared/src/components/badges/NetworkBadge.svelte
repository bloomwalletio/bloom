<script lang="ts">
    import { Tooltip } from '@bloomwalletio/ui'
    import { NetworkId, getNameFromNetworkId } from '@core/network'
    import { NetworkAvatar } from '@ui'

    export let networkId: NetworkId
    export let networkName: string | undefined = undefined
    export let size: 'xxs' | 'xs' | 'sm' | 'md' = 'sm'

    let anchor: HTMLElement

    $: networkName = networkName ? networkName : networkId ? getNameFromNetworkId(networkId) : undefined
</script>

<network-icon-badge
    bind:this={anchor}
    class="block absolute -right-1 -bottom-1 rounded-full bg-white dark:bg-gray-900 {size === 'md' ? 'p-1' : 'p-0.5'}"
>
    <NetworkAvatar {size} {networkId} />
</network-icon-badge>
{#if networkName}
    <Tooltip {anchor} text={networkName} placement="right" event="hover" />
{/if}

<script lang="ts">
    import { NetworkId } from '@core/network'
    import { NetworkAvatar } from '@ui'

    export let networkId: NetworkId
    export let networkName: string | undefined = undefined
    export let size: 'xxs' | 'xs' | 'sm' | 'md' = 'sm'
</script>

<network-icon-badge
    class="block absolute -right-1 -bottom-1 rounded-full bg-white dark:bg-gray-900 {size === 'md' ? 'p-1' : 'p-0.5'}"
>
    <NetworkAvatar {size} {networkId} {networkName} showTooltip />
</network-icon-badge>

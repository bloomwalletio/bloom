<script lang="ts">
    import { AvatarGroup } from '@bloomwalletio/ui'
    import { NetworkId } from '@core/network'
    import NetworkAvatar from './NetworkAvatar.svelte'

    export let networkIds: NetworkId[]
    export let size: 'xxs' | 'xs' | 'sm' | 'base' | 'md' = 'base'
</script>

<AvatarGroup avatarSize={size}>
    {#each networkIds as networkId}
        <NetworkAvatar {networkId} {size} showTooltip />
    {/each}
</AvatarGroup>

<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { NetworkId, getNameFromNetworkId } from '@core/network'
    import NetworkAvatar from '@ui/avatars/NetworkAvatar.svelte'

    export let networkId: NetworkId

    $: network = getNameFromNetworkId(networkId)
</script>

<div class="flex items-center gap-2">
    <NetworkAvatar {networkId} size="sm" />
    <Text textColor="secondary" fontWeight="medium">{network}</Text>
</div>

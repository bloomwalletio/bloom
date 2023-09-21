<script lang="ts">
    import { Activity, ActivityType } from '@core/activity'
    import AddressWithNetwork from '../AddressWithNetwork.svelte'
    import { Icon, IconName } from '@bloomwalletio/ui'

    export let activity: Activity

    $: isSelfTransaction =
        (activity.sender &&
            activity.sender.address === activity.recipient?.address &&
            activity.sourceNetworkId === activity.destinationNetworkId) ||
        [ActivityType.Consolidation, ActivityType.Alias, ActivityType.Governance].includes(activity.type)
</script>

<div class="h-full w-full flex flex-row items-center">
    {#if (!activity.sender && !activity.recipient) || isSelfTransaction}
        <div class="w-8" />
    {:else}
        <Icon name={IconName.Graph} size="md" color="gray-300" />
    {/if}

    <div class="flex flex-col justify-between">
        {#if !activity.sender && !activity.recipient}
            <AddressWithNetwork subject={undefined} networkId={activity.destinationNetworkId} />
        {:else if isSelfTransaction}
            <AddressWithNetwork subject={activity.sender} networkId={activity.destinationNetworkId} />
        {:else}
            <AddressWithNetwork subject={activity.sender} networkId={activity.sourceNetworkId} />
            <AddressWithNetwork subject={activity.recipient} networkId={activity.destinationNetworkId} />
        {/if}
    </div>
</div>

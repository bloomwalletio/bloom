<script lang="ts">
    import { StardustActivity } from '@core/activity'
    import AddressWithNetwork from '../AddressWithNetwork.svelte'
    import AddressIcon from '../AddressIcon.svelte'

    export let activity: StardustActivity
</script>

<div class="h-full w-full flex flex-row items-center text-secondary">
    <AddressIcon {activity} />

    <div class="flex flex-col justify-between">
        <AddressWithNetwork subject={activity.sender} networkId={activity.sourceNetworkId} />
        <AddressWithNetwork subject={activity.recipient} networkId={activity.destinationNetworkId} />
    </div>
</div>

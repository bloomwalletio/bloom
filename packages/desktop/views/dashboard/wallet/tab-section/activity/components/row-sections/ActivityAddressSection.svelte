<script lang="ts">
    import { Activity, ActivityAction, ActivityType } from '@core/activity'
    import AddressWithNetwork from '../AddressWithNetwork.svelte'
    import { appSettings } from '@core/app/stores'

    export let activity: Activity

    $: isSelfTransaction =
        (activity.sender &&
            activity.sender.address === activity.recipient?.address &&
            activity.sourceNetworkId === activity.destinationNetworkId) ||
        [ActivityType.Consolidation, ActivityType.Alias, ActivityType.Governance].includes(activity.type) ||
        [ActivityAction.Mint, ActivityAction.Burn].includes(activity.action)

    $: svgColor = $appSettings.darkMode ? '#6F778A' : '#D1D5DB'
</script>

<div class="h-full w-full flex flex-row items-center">
    {#if (!activity.sender && !activity.recipient) || isSelfTransaction}
        <div class="w-8" />
    {:else}
        <svg width="32" height="30" viewBox="0 0 15 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
                <circle cx="5" cy="5.25735" r="4" stroke={svgColor} stroke-width="2" />
                <path
                    d="M10.2426 21.2574L13.0711 24.0858C13.8521 24.8668 13.8521 26.1332 13.0711 26.9142L10.2426 29.7426"
                    stroke={svgColor}
                    stroke-width="2"
                />
                <path d="M5 9V21.2574C5 23.4665 6.79086 25.2574 9 25.2574H13" stroke={svgColor} stroke-width="2" />
            </g>
        </svg>
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

<script lang="ts">
    import { Activity, ActivityAction, ActivityType } from '@core/activity'
    import { isSubjectInternal } from '@core/wallet'

    export let activity: Activity

    $: isSelfTransaction =
        (activity.sender &&
            activity.sender.address === activity.recipient?.address &&
            activity.sourceNetworkId === activity.destinationNetworkId) ||
        [ActivityType.Consolidation, ActivityType.Alias, ActivityType.Governance].includes(activity.type) ||
        [ActivityAction.Mint, ActivityAction.Burn].includes(activity.action)
</script>

{#if isSubjectInternal(activity.sender) && isSubjectInternal(activity.recipient)}
    <svg width="11" height="29" viewBox="0 0 11 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.5">
            <path
                d="M6.24264 19.0754L9.07107 21.9038C9.85212 22.6848 9.85212 23.9512 9.07107 24.7322L6.24264 27.5606"
                stroke="#6F778A"
                stroke-width="2"
            />
            <path
                d="M1 18.0753C1 13.6854 1 10.7409 1 7.07539C1 4.86625 2.79086 3.07532 5 3.07532H9"
                stroke="#6F778A"
                stroke-width="2"
            />
            <path d="M1 6.81799V19.0753C1 21.2845 2.79086 23.0753 5 23.0753H9" stroke="#6F778A" stroke-width="2" />
        </g>
    </svg>
{:else if isSubjectInternal(activity.sender) && !isSubjectInternal(activity.recipient)}
    <svg width="14" height="30" viewBox="0 0 14 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.5">
            <path
                d="M5.24219 19.5V6.5C5.24219 4.29086 7.03305 2.5 9.24219 2.5H13.2422"
                stroke="#6F778A"
                stroke-width="2"
            />
            <path
                d="M1.00028 15.2426L3.82871 18.0711C4.60976 18.8521 5.87608 18.8521 6.65713 18.0711L9.48556 15.2426"
                stroke="#6F778A"
                stroke-width="2"
            />
        </g>
        <circle cx="5" cy="24.5" r="4" stroke="#B7BBC5" stroke-width="2" />
    </svg>
{:else if !isSubjectInternal(activity.sender) && isSubjectInternal(activity.recipient)}
    <svg width="32" height="30" viewBox="0 0 15 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
            <circle cx="5" cy="5.25735" r="4" stroke="currentColor" stroke-width="2" />
            <path
                d="M10.2426 21.2574L13.0711 24.0858C13.8521 24.8668 13.8521 26.1332 13.0711 26.9142L10.2426 29.7426"
                stroke="currentColor"
                stroke-width="2"
            />
            <path d="M5 9V21.2574C5 23.4665 6.79086 25.2574 9 25.2574H13" stroke="currentColor" stroke-width="2" />
        </g>
    </svg>
{:else}
    <div class="w-8" />
{/if}

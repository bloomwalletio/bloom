<script lang="ts">
    import { Activity } from '@core/activity'
    import { isSubjectInternal } from '@core/wallet'

    export let activity: Activity
</script>

{#if isSubjectInternal(activity.sender) && isSubjectInternal(activity.recipient)}
    <svg width="32" height="30" viewBox="0 0 11 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.5">
            <path
                d="M6.24264 18.636L9.07107 21.4644C9.85212 22.2455 9.85212 23.5118 9.07107 24.2929L6.24264 27.1213"
                stroke="currentColor"
                stroke-width="2"
            />
            <path
                d="M1 16.5607C1 13.3736 1 11.1388 1 8.56105C1 6.35191 2.79086 4.56067 5 4.56067H9"
                stroke="currentColor"
                stroke-width="2"
            />
            <path d="M1 8.56067V18.5607C1 20.7698 2.79086 22.5607 5 22.5607H9" stroke="currentColor" stroke-width="2" />
        </g>
    </svg>
{:else if isSubjectInternal(activity.sender) && !isSubjectInternal(activity.recipient)}
    <svg width="32" height="30" viewBox="0 0 13 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.5">
            <circle cx="5" cy="19" r="4" stroke="currentColor" stroke-width="2" />
            <path
                d="M9.24264 10.2426L6.41421 13.0711C5.63316 13.8521 4.36683 13.8521 3.58579 13.0711L0.757359 10.2426"
                stroke="currentColor"
                stroke-width="2"
            />
            <path d="M5 13V5C5 2.79086 6.79086 1 9 1H13" stroke="currentColor" stroke-width="2" />
        </g>
    </svg>
{:else if !isSubjectInternal(activity.sender) && isSubjectInternal(activity.recipient)}
    <svg width="32" height="30" viewBox="0 0 15 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.5">
            <circle cx="5" cy="5" r="4" stroke="currentColor" stroke-width="2" />
            <path
                d="M10.2426 19L13.0711 21.8285C13.8521 22.6095 13.8521 23.8758 13.0711 24.6569L10.2426 27.4853"
                stroke="currentColor"
                stroke-width="2"
            />
            <path
                d="M5 8.74268V18.7427C5 20.9518 6.79086 22.7427 9 22.7427H13"
                stroke="currentColor"
                stroke-width="2"
            />
        </g>
    </svg>
{:else}
    <div class="w-8" />
{/if}

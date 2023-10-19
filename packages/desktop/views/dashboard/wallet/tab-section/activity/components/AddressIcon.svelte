<script lang="ts">
    import { Activity } from '@core/activity'
    import { isSubjectInternal } from '@core/wallet'

    export let activity: Activity
</script>

{#if isSubjectInternal(activity.sender) && isSubjectInternal(activity.recipient)}
    <svg width="32" height="29" viewBox="0 0 16 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.5">
            <path
                d="M11.2426 18.7574L14.0711 21.5858C14.8521 22.3668 14.8521 23.6332 14.0711 24.4142L11.2426 27.2426"
                stroke="#6F778A"
                stroke-width="2"
                stroke-linecap="round"
            />
            <path
                d="M7 17C7 13.8129 7 11.5781 7 9.00038C7 6.79124 8.79086 5 11 5H12"
                stroke="#6F778A"
                stroke-width="2"
                stroke-linecap="round"
            />
            <path d="M7 9V19C7 21.2091 8.79086 23 11 23H14" stroke="#6F778A" stroke-width="2" />
        </g>
    </svg>
{:else if isSubjectInternal(activity.sender) && !isSubjectInternal(activity.recipient)}
    <svg width="32" height="28" viewBox="0 0 14 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.5">
            <circle cx="7" cy="23" r="3" stroke="#6F778A" stroke-width="2" />
            <path
                d="M11.2426 15.3221L8.40103 18.2169C7.62726 19.0052 6.37273 19.0052 5.59897 18.2169L2.75736 15.3221"
                stroke="#6F778A"
                stroke-width="2"
                stroke-linecap="round"
            />
            <path
                d="M12 4C12.5523 4 13 4.44771 13 5C13 5.55229 12.5523 6 12 6V4ZM6 20V9H8V20H6ZM11 4H12V6H11V4ZM6 9C6 6.23858 8.23858 4 11 4V6C9.34315 6 8 7.34315 8 9H6Z"
                fill="#6F778A"
            />
        </g>
    </svg>
{:else if !isSubjectInternal(activity.sender) && isSubjectInternal(activity.recipient)}
    <svg width="32" height="29" viewBox="0 0 16 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.5">
            <circle cx="7" cy="5" r="3" stroke="#6F778A" stroke-width="2" />
            <path
                d="M11.2426 18.7574L14.0711 21.5858C14.8521 22.3668 14.8521 23.6332 14.0711 24.4142L11.2426 27.2426"
                stroke="#6F778A"
                stroke-width="2"
                stroke-linecap="round"
            />
            <path d="M7 8V19C7 21.2091 8.79086 23 11 23H14" stroke="#6F778A" stroke-width="2" />
        </g>
    </svg>
{:else}
    <div class="w-8" />
{/if}

<script lang="ts">
    import { fade } from 'svelte/transition'
    import { ToastWrapper } from './'
    import { appNotifications } from '@auxiliary/notification/stores'

    export let classes: string = ''
</script>

{#if $appNotifications?.length > 0}
    <toast-container class={`flex flex-col z-50 ${classes}`} transition:fade|local={{ duration: 0 }}>
        <ul class="space-y-2">
            {#each $appNotifications as notification (notification.id)}
                <li transition:fade|local={{ duration: 0 }}>
                    <ToastWrapper {notification} />
                </li>
            {/each}
        </ul>
    </toast-container>
{/if}

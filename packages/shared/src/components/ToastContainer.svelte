<script lang="ts">
    import { fade } from 'svelte/transition'
    import { Swiper, ToastWrapper } from './'
    import { appNotifications } from '@auxiliary/notification/stores'

    export let classes: string = ''
    export let swipe: boolean = false
    export let fadeDuration: number = 0
</script>

{#if $appNotifications?.length > 0}
    <toast-container class={`flex flex-col z-50 ${classes}`} transition:fade|local={{ duration: fadeDuration }}>
        <ul class="space-y-2">
            {#each $appNotifications as notification (notification.id)}
                <li transition:fade|local={{ duration: fadeDuration }}>
                    {#if swipe}
                        <Swiper toastId={notification.id}>
                            <ToastWrapper {notification} />
                        </Swiper>
                    {:else}
                        <ToastWrapper {notification} />
                    {/if}
                </li>
            {/each}
        </ul>
    </toast-container>
{/if}

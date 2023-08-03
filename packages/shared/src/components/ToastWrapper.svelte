<script lang="ts">
    import { Notification } from '@auxiliary/notification'
    import { AppUpdateToast, Toast } from './'

    export let notification: Notification
</script>

{#if notification.variant === 'appUpdate'}
    <AppUpdateToast />
{:else}
    <!-- Specify variant explicitly for type narrowing -->
    <Toast {...notification} />
{/if}

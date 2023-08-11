<script lang="ts">
    import { Notification } from '@auxiliary/notification'
    import { AppUpdateToast } from './'
    import { Toast } from '@bloomwalletio/ui'

    export let notification: Notification
</script>

{#if notification.variant === 'appUpdate'}
    <AppUpdateToast />
{:else}
    <!-- Specify variant explicitly for type narrowing -->
    <Toast {...notification} variant={notification?.variant === 'error' ? 'danger' : notification?.variant} />
{/if}

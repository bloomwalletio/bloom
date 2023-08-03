<script lang="ts">
    import { INotification } from '@auxiliary/notification'
    import { AppUpdateToast, Toast } from './'

    export let notification: INotification
</script>

{#if notification.variant === 'appUpdate'}
    <AppUpdateToast />
{:else}
    <!-- Specify variant explicitly for type narrowing -->
    <Toast {...notification} variant={notification.variant} />
{/if}

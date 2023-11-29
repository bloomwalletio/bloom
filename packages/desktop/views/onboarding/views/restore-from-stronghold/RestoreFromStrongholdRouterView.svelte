<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { UpdateStrongholdRouterView } from '@views/update-stronghold'
    import { RestoreFromStrongholdRoute } from './restore-from-stronghold-route.enum'
    import { restoreFromStrongholdRoute } from './restore-from-stronghold-router'
    import { ImportStrongholdView, UnlockBackupView } from './views'

    $: if (features.analytics.onboardingRoute.enabled && $restoreFromStrongholdRoute) {
        Platform.trackEvent('restore-from-stronghold-route', { route: $restoreFromStrongholdRoute })
    }
</script>

{#if $restoreFromStrongholdRoute === RestoreFromStrongholdRoute.ImportStronghold}
    <ImportStrongholdView />
{:else if $restoreFromStrongholdRoute === RestoreFromStrongholdRoute.UnlockBackup}
    <UnlockBackupView />
{:else if $restoreFromStrongholdRoute === RestoreFromStrongholdRoute.UpdateStronghold}
    <UpdateStrongholdRouterView isRecovery />
{/if}

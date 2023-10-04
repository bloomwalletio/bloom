<script lang="ts">
    import { isLocaleLoaded } from '@core/i18n'
    import { dashboardRouter, settingsRouter } from '@core/router'
    import { IconButton, IconName } from '@bloomwalletio/ui'
    import { onDestroy } from 'svelte'
    import { SettingsViewer } from './views'

    export let handleClose: () => void = undefined

    function closeSettings(): void {
        $dashboardRouter.previous()
    }

    onDestroy((): void => {
        // When a new locale is loaded the pages are reloaded
        // so don't reset the router in this case
        if ($isLocaleLoaded) {
            $settingsRouter.reset()
        }
    })
</script>

<div class="relative h-full w-full p-8 bg-surface dark:bg-surface-dark flex flex-1">
    <div class="absolute top-8 right-8">
        <IconButton icon={IconName.CrossClose} on:click={handleClose || closeSettings} />
    </div>
    <SettingsViewer />
</div>

<script lang="ts">
    import { isLocaleLoaded } from '@core/i18n'
    import { dashboardRouter, settingsRouter } from '@core/router'
    import { CloseButton } from '@bloomwalletio/ui'
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

<overlay class="fixed h-full w-full p-8 flex flex-1 bg-neutral-6/75 z-30">
    <settings-popup class="relative">
        <div class="absolute top-8 right-8">
            <CloseButton on:click={handleClose || closeSettings} />
        </div>
        <SettingsViewer />
    </settings-popup>
</overlay>

<style lang="scss">
    settings-popup {
        @apply w-full;
        @apply bg-surface dark:bg-surface-dark;
        border-radius: 32px;
    }
</style>

<script lang="ts">
    import { CloseButton } from '@bloomwalletio/ui'
    import { closeSettings } from '@contexts/settings/stores'
    import { Platform } from '@core/app'
    import { isLocaleLoaded } from '@core/i18n'
    import { settingsRoute, settingsRouter } from '@core/router'
    import { clickOutside } from '@core/utils/ui'
    import features from '@features/features'
    import { onDestroy } from 'svelte'
    import { fade } from 'svelte/transition'
    import { SettingsViewer } from './views'

    $: if (features.analytics.dashboardRoute.settings.enabled && $settingsRoute) {
        Platform.trackEvent('settings-route', { route: $settingsRoute })
    }

    function onKey(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            closeSettings()
        }
    }
    onDestroy((): void => {
        // When a new locale is loaded the pages are reloaded
        // so don't reset the router in this case
        if ($isLocaleLoaded) {
            $settingsRouter.reset()
        }
    })
</script>

<svelte:window on:keydown={onKey} />

<overlay
    in:fade={{ duration: 100 }}
    out:fade={{ duration: 50 }}
    class="fixed h-screen w-screen flex flex-1 justify-center items-center bg-neutral-6/75 z-30"
>
    <settings-popup class="relative" use:clickOutside on:clickOutside={closeSettings}>
        <div class="absolute top-8 right-8">
            <CloseButton on:click={closeSettings} />
        </div>
        <SettingsViewer />
    </settings-popup>
</overlay>

<style lang="scss">
    settings-popup {
        @apply bg-surface dark:bg-surface-dark;
        width: 1216px;
        height: 632px;
        border-radius: 32px;
    }
</style>

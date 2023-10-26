<script lang="ts">
    import features from '@features/features'
    import { isLocaleLoaded } from '@core/i18n'
    import { settingsRoute, settingsRouter } from '@core/router'
    import { CloseButton } from '@bloomwalletio/ui'
    import { onDestroy } from 'svelte'
    import { SettingsViewer } from './views'
    import { closeSettings } from '@contexts/settings/stores'
    import { Platform } from '@core/app'
    import { clickOutside } from '@core/utils'

    $: if (features.analytics.dashboardRoute.settings.enabled && $settingsRoute) {
        Platform.trackEvent('settings-route', { route: $settingsRoute })
    }

    onDestroy((): void => {
        // When a new locale is loaded the pages are reloaded
        // so don't reset the router in this case
        if ($isLocaleLoaded) {
            $settingsRouter.reset()
        }
    })
</script>

<overlay class="fixed h-screen w-screen flex flex-1 justify-center items-center bg-neutral-6/75 z-30">
    <settings-popup use:clickOutside on:clickOutside={closeSettings} class="relative">
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

<script lang="ts">
    import { isLocaleLoaded } from '@core/i18n'
    import { settingsRouter } from '@core/router'
    import { CloseButton } from '@bloomwalletio/ui'
    import { onDestroy } from 'svelte'
    import { SettingsViewer } from './views'
    import { closeSettings } from '@contexts/settings/stores'

    onDestroy((): void => {
        // When a new locale is loaded the pages are reloaded
        // so don't reset the router in this case
        if ($isLocaleLoaded) {
            $settingsRouter.reset()
        }
    })
</script>

<overlay class="fixed h-screen w-screen flex flex-1 justify-center items-center bg-neutral-6/75 z-30">
    <settings-popup class="relative">
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

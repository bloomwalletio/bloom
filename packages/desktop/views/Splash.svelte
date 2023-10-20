<script lang="ts">
    import { LogoName } from '@auxiliary/logo'
    import { shouldBeDarkMode } from '@core/app'
    import { appSettings } from '@core/app/stores'
    import { Logo } from '@ui'

    // Why is this here?
    /**
     * NOTE: This reactive dependency ensures that darkMode is set to the
     * correct value in the case that the system's settings have changed since
     * the app was last opened.
     */
    $: $appSettings.darkMode = shouldBeDarkMode($appSettings.theme)
</script>

<div
    class="w-full h-full flex flex-col justify-center items-center animate-pulse pr-100 bg-surface dark:bg-surface-dark"
>
    <Logo width="400" logo={LogoName.BloomLogoFull} />
</div>

<style type="postcss">
    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.8;
        }
    }
</style>

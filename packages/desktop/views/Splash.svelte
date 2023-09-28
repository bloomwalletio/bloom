<script lang="ts">
    import { LogoName } from '@auxiliary/logo'
    import { shouldBeDarkMode } from '@core/app'
    import { appSettings } from '@core/app/stores'
    import { Logo } from '@ui'
    import LoggedOutLayout from './components/LoggedOutLayout.svelte'

    // Why is this here?
    /**
     * NOTE: This reactive dependency ensures that darkMode is set to the
     * correct value in the case that the system's settings have changed since
     * the app was last opened.
     */
    $: $appSettings.darkMode = shouldBeDarkMode($appSettings.theme)
</script>

<LoggedOutLayout>
    <div slot="content" class="animate-pulse pr-100">
        <Logo width="400" logo={LogoName.BloomLogoFull} />
    </div>
</LoggedOutLayout>

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

<script lang="ts">
    import { handleDeepLink } from '@auxiliary/deep-link/handlers/handleDeepLink'
    import { Popup, ProfileAuthPopup } from '@components/popup'
    import TitleBar from '@components/TitleBar.svelte'
    import { IS_WINDOWS, Platform, openUrlInBrowser } from '@core/app'
    import {
        registerAppEvents,
        getAndUpdateDarkMode,
        updateAppParametersWithRemoteConfiguration,
    } from '@core/app/actions'
    import { appSettings, appVersionDetails, initAppSettings, setAppVersionDetails, windowSize } from '@core/app/stores'
    import { isLocaleLoaded, localeDirection, setupI18n } from '@core/i18n'
    import { checkAndMigrateProfiles, cleanupEmptyProfiles, saveActiveProfile } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { AppRoute, RouterManagerExtensionName, appRoute, initialiseRouterManager } from '@core/router'
    import { PopupId, openPopup, popupState, profileAuthPopup } from '@desktop/auxiliary/popup'
    import {
        getAppRouter,
        getRouterForAppContext,
        goToAppContext,
        initialiseRouters,
        resetRouterForAppContext,
        resetRouters,
    } from '@desktop/routers'
    import features from '@features/features'
    import { ToastContainer } from '@ui'
    import { Dashboard, LoginRouter, Settings, Splash } from '@views'
    import { OnboardingRouterView } from '@views/onboarding'
    import { onDestroy, onMount } from 'svelte'
    import { getLocalisedMenuItems, registerMenuButtons } from './lib/helpers'
    import { settingsState, openSettings } from '@contexts/settings/stores'
    import { _ } from '@core/i18n'
    import { getAndUpdateShimmerEvmTokensMetadata } from '@core/market/actions'
    import { initializeWalletConnect } from '@auxiliary/wallet-connect/actions'
    import { getAndUpdateCountryCode } from '@auxiliary/country/actions'

    $: $activeProfile, saveActiveProfile()

    async function handleCrashReporting(sendCrashReports: boolean): Promise<void> {
        await Platform.updateAppSettings({ sendCrashReports })
    }

    $: void handleCrashReporting($appSettings.sendCrashReports)

    $: $_, Platform.updateMenu('strings', getLocalisedMenuItems())

    $: if (document.dir !== $localeDirection) {
        document.dir = $localeDirection
    }

    let splash = true

    void setupI18n({ fallbackLocale: 'en', initialLocale: $appSettings.language })
    void getAndUpdateCountryCode()

    onMount(async () => {
        if (features.analytics.appStart.enabled) {
            Platform.trackEvent('app-start')
        }

        $windowSize = {
            width: window.innerWidth,
            height: window.innerHeight,
        }
        window.addEventListener(
            'resize',
            () =>
                ($windowSize = {
                    width: window.innerWidth,
                    height: window.innerHeight,
                })
        )

        // Theme
        Platform.onEvent('native-theme-updated', getAndUpdateDarkMode)
        // Set dark mode initially in case the native theme is already in system
        await getAndUpdateDarkMode()

        await updateAppParametersWithRemoteConfiguration()
        await checkAndMigrateProfiles()
        await cleanupEmptyProfiles()
        Platform.onEvent('deep-link-request', handleDeepLink)
        Platform.onEvent('try-open-url-in-browser', openUrlInBrowser)

        setTimeout(() => {
            splash = false
            // check if deep link request was received while splash screen was active
            Platform.DeepLinkManager?.checkForDeepLinkRequest()
        }, 3000)
        initAppSettings.set($appSettings)

        initialiseRouters()
        initialiseRouterManager({
            extensions: [
                [RouterManagerExtensionName.GetAppRouter, getAppRouter],
                [RouterManagerExtensionName.GetRouterForAppContext, getRouterForAppContext],
                [RouterManagerExtensionName.GoToAppContext, goToAppContext],
                // TODO: https://github.com/iotaledger/firefly/issues/5201
                [RouterManagerExtensionName.OpenSettings, openSettings],
                [RouterManagerExtensionName.ResetRouterForAppContext, resetRouterForAppContext],
                [RouterManagerExtensionName.ResetRouters, resetRouters],
            ],
        })

        // Used for auto updates
        registerAppEvents()
        if (process.env.NODE_ENV !== 'development') {
            await setAppVersionDetails()
            if ($appVersionDetails.upToDate === false) {
                openPopup({ id: PopupId.CheckForUpdates }, false, false)
            }
        }

        registerMenuButtons()
        void initializeWalletConnect()
        await getAndUpdateShimmerEvmTokensMetadata()
    })

    onDestroy(() => {
        Platform.removeListenersForEvent('deep-link-request')
        Platform.DeepLinkManager?.clearDeepLinkRequest()
    })
</script>

<app class="w-full h-full flex flex-col">
    {#if IS_WINDOWS}
        <TitleBar />
    {/if}
    {#key $_}
        <app-container class="relative w-screen h-full flex flex-col" class:windows={IS_WINDOWS}>
            {#if !$isLocaleLoaded || splash}
                <Splash />
            {:else}
                {#if $settingsState.open}
                    <Settings />
                {/if}
                {#if $popupState.active}
                    <Popup
                        id={$popupState.id}
                        props={$popupState.props}
                        hideClose={$popupState.hideClose}
                        transition={$popupState.transition}
                        overflow={$popupState.overflow}
                        relative={$popupState.relative}
                        preventClose={$popupState.preventClose}
                        autofocusContent={$popupState.autofocusContent}
                        confirmClickOutside={$popupState.confirmClickOutside}
                    />
                {/if}
                {#if $profileAuthPopup.active}
                    <ProfileAuthPopup
                        id={$profileAuthPopup.id}
                        props={$profileAuthPopup.props}
                        hideClose={$profileAuthPopup.hideClose}
                        preventClose={$profileAuthPopup.preventClose}
                    />
                {/if}
                {#if $appRoute === AppRoute.Dashboard}
                    <Dashboard />
                {:else if $appRoute === AppRoute.Login}
                    <LoginRouter />
                {:else if $appRoute === AppRoute.Onboarding}
                    <OnboardingRouterView />
                {/if}

                <ToastContainer classes="absolute right-5 bottom-5 w-[23.75rem]" />
            {/if}
            <app-container />
        </app-container>
    {/key}
</app>

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    @import '../shared/src/style/style.css';

    html,
    body {
        @apply bg-surface dark:bg-surface-dark;
        @apply select-none;
        -webkit-user-drag: none;

        /* ===== Scrollbar CSS ===== */
        /* Chrome, Edge, and Safari */
        *::-webkit-scrollbar {
            @apply w-2;
            @apply h-2;
        }

        *::-webkit-scrollbar-button {
            display: none;
        }
        *::-webkit-scrollbar-track {
            @apply bg-transparent;
        }

        *::-webkit-scrollbar-corner {
            @apply bg-transparent;
        }

        *::-webkit-scrollbar-thumb {
            @apply bg-gray-300;
            @apply rounded-2xl;
            @apply border-none;
            @apply invisible;
        }

        *:hover::-webkit-scrollbar-thumb {
            @apply visible;
        }

        .overlay-scrollbar {
            overflow: scroll;
            overflow-x: overlay;
            overflow-y: overlay;
        }

        *::-webkit-scrollbar-thumb {
            @apply dark:border-gray-900;
        }

        .multiwrap-line2 {
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            display: -webkit-box;
        }
    }

    @layer utilities {
        .scrollable-y {
            @apply overflow-y-auto;
            @apply -mr-2;
            @apply pr-2;
        }
    }

    img {
        -webkit-user-drag: none;
    }

    hr {
        @apply border-t;
        @apply border-solid;
        @apply border-stroke dark:border-stroke-dark;
    }

    .windows {
        height: calc(100vh - 28px);
    }
</style>

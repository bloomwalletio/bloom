<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { Popup, TitleBar } from '@components'
    import { ToastContainer } from '@ui'
    import { Dashboard, LoginRouter, Settings, Splash } from '@views'
    import { OnboardingRouterView } from '@views/onboarding'
    import { handleDeepLink } from '@auxiliary/deep-link/handlers'
    import { IS_WINDOWS, Platform } from '@core/app'
    import { registerAppEvents } from '@core/app/actions'
    import { appSettings, appVersionDetails, initAppSettings, setAppVersionDetails } from '@core/app/stores'
    import { isLocaleLoaded, localeDirection, setupI18n } from '@core/i18n'
    import { registerLedgerDeviceEventHandlers } from '@core/ledger'
    import { downloadNextNftInQueue } from '@core/nfts/actions'
    import { nftDownloadQueue } from '@core/nfts/stores'
    import { checkAndMigrateProfiles, cleanupEmptyProfiles, saveActiveProfile } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import {
        AppRoute,
        DashboardRoute,
        RouterManagerExtensionName,
        appRoute,
        dashboardRouter,
        initialiseRouterManager,
        routerManager,
    } from '@core/router'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { PopupId, closePopup, openPopup, popupState } from '@desktop/auxiliary/popup'
    import {
        getAppRouter,
        getRouterForAppContext,
        goToAppContext,
        initialiseRouters,
        openSettings,
        resetRouterForAppContext,
        resetRouters,
    } from '@desktop/routers'
    import features from '@features/features'
    import { getLocalisedMenuItems } from './lib/helpers'

    const { loggedIn } = $activeProfile

    $: if ($activeProfile && !$loggedIn) {
        closePopup(true)
    }
    $: $activeProfile, saveActiveProfile()

    async function handleCrashReporting(sendCrashReports: boolean): Promise<void> {
        await Platform.updateAppSettings({ sendCrashReports })
    }

    $: void handleCrashReporting($appSettings.sendCrashReports)

    $: {
        if ($isLocaleLoaded) {
            Platform.updateMenu('strings', getLocalisedMenuItems())
        }
    }

    $: if (document.dir !== $localeDirection) {
        document.dir = $localeDirection
    }

    $: $nftDownloadQueue, downloadNextNftInQueue()

    $: Platform.updateTheme($appSettings.theme)

    let splash = true
    let settings = false

    void setupI18n({ fallbackLocale: 'en', initialLocale: $appSettings.language })

    onMount(async () => {
        features.analytics.appStart.enabled && Platform.trackEvent('app-start')
        await cleanupEmptyProfiles()
        checkAndMigrateProfiles()
        Platform.onEvent('deep-link-request', handleDeepLink)

        setTimeout(() => {
            splash = false
            // check if deep link request was received while splash screen was active
            Platform.DeepLinkManager.checkForDeepLinkRequest()
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
                openPopup({ id: PopupId.CheckForUpdates })
            }
        }

        Platform.onEvent('menu-navigate-wallet', () => {
            $dashboardRouter.goTo(DashboardRoute.Wallet)
        })
        Platform.onEvent('menu-navigate-settings', () => {
            if ($loggedIn) {
                closePopup()
                closeDrawer()
                $routerManager.openSettings()
            } else {
                settings = true
            }
        })
        Platform.onEvent('menu-check-for-update', () => {
            closeDrawer()
            openPopup({
                id: PopupId.CheckForUpdates,
                props: {
                    currentVersion: $appVersionDetails.currentVersion,
                },
            })
        })
        Platform.onEvent('menu-error-log', () => {
            closeDrawer()
            openPopup({ id: PopupId.ErrorLog })
        })
        Platform.onEvent('menu-diagnostics', () => {
            closeDrawer()
            openPopup({ id: PopupId.Diagnostics })
        })

        registerLedgerDeviceEventHandlers()
    })

    onDestroy(() => {
        Platform.removeListenersForEvent('deep-link-request')
        Platform.DeepLinkManager.clearDeepLinkRequest()
    })
</script>

<app class="w-full h-full flex flex-col">
    {#if IS_WINDOWS}
        <TitleBar />
    {/if}
    <app-container class="w-screen h-full" class:windows={IS_WINDOWS}>
        {#if !$isLocaleLoaded || splash}
            <Splash />
        {:else}
            {#if $popupState.active}
                <Popup
                    id={$popupState.id}
                    props={$popupState.props}
                    hideClose={$popupState.hideClose}
                    fullScreen={$popupState.fullScreen}
                    transition={$popupState.transition}
                    overflow={$popupState.overflow}
                    relative={$popupState.relative}
                />
            {/if}
            {#if $appRoute === AppRoute.Dashboard}
                <Dashboard />
            {:else if $appRoute === AppRoute.Login}
                <LoginRouter />
            {:else if $appRoute === AppRoute.Onboarding}
                <OnboardingRouterView />
            {/if}
            {#if settings}
                <Settings handleClose={() => (settings = false)} />
            {/if}
            <ToastContainer classes="absolute right-5 bottom-5 w-100" />
        {/if}
        <app-container />
    </app-container></app
>

<style global lang="scss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    @import '../shared/src/style/style.scss';
    html,
    body {
        @apply bg-slate-100 dark:bg-gray-900;
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

        :global(::-webkit-scrollbar-thumb) {
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
        @apply border-gray-200;
        @apply dark:border-gray-800;
    }

    .windows {
        height: calc(100vh - 28px);
    }
</style>

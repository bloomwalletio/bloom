<script lang="ts">
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { Platform } from '@core/app'
    import { clearLayer2TokensPoll, pollLayer2Tokens } from '@core/layer-2'
    import { stopPollingLedgerEthereumAppSettings, stopPollingLedgerNanoStatus } from '@core/ledger'
    import {
        addNftsToDownloadQueue,
        downloadNextNftInQueue,
        interruptNftDownloadAfterTimeout,
    } from '@core/nfts/actions'
    import { downloadingNftId, nftDownloadQueue, resetNftDownloadQueue, selectedAccountNfts } from '@core/nfts/stores'
    import { logout, reflectLockedStronghold } from '@core/profile/actions'
    import { hasStrongholdLocked, isActiveLedgerProfile } from '@core/profile/stores'
    import { appRouter, dashboardRoute } from '@core/router'
    import features from '@features/features'
    import { Idle } from '@ui'
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'
    import Sidebar from './Sidebar.svelte'
    import TopNavigation from './TopNavigation.svelte'
    import Collectibles from './collectibles/Collectibles.svelte'
    import { Developer } from './developer'
    import { Governance } from './governance'
    import { Settings } from './settings'
    import { Wallet } from './wallet'
    import { DashboardDrawerRouterView } from './drawers'

    const tabs = {
        wallet: Wallet,
        settings: Settings,
        collectibles: Collectibles,
        governance: Governance,
        developer: Developer,
    }

    $: $hasStrongholdLocked && reflectLockedStronghold()
    $: $nftDownloadQueue, downloadNextNftInQueue()
    $: $downloadingNftId && interruptNftDownloadAfterTimeout(get(selectedAccountIndex))
    $: addSelectedAccountNftsToDownloadQueue($selectedAccountIndex)

    $: if (features.analytics.dashboardRoute.enabled && $dashboardRoute)
        Platform.trackEvent('dashboard-route', { route: $dashboardRoute })

    function addSelectedAccountNftsToDownloadQueue(accountIndex: number): void {
        resetNftDownloadQueue()
        void addNftsToDownloadQueue(accountIndex, $selectedAccountNfts)
    }

    onMount(() => {
        Platform.onEvent('menu-logout', () => {
            logout()
        })

        Platform.onEvent('lock-screen', () => {
            logout()
        })

        Platform.DeepLinkManager.checkDeepLinkRequestExists()

        void pollLayer2Tokens($selectedAccount)
    })

    onDestroy(() => {
        Platform.DeepLinkManager.clearDeepLinkRequest()
        if ($isActiveLedgerProfile) {
            stopPollingLedgerNanoStatus()
            stopPollingLedgerEthereumAppSettings()
        }
        clearLayer2TokensPoll()
    })
</script>

<Idle />
<div class="dashboard-wrapper flex flex-col w-full h-full">
    <TopNavigation />
    <div class="flex flex-row flex-auto h-1">
        <Sidebar />
        <!-- Dashboard Pane -->
        <div class="flex flex-col h-full dashboard-w">
            <svelte:component this={tabs[$dashboardRoute]} on:next={$appRouter.next} />
            <DashboardDrawerRouterView />
        </div>
    </div>
</div>

<style lang="scss">
    :global(:not(body.platform-win32)) .dashboard-wrapper {
        margin-top: calc(env(safe-area-inset-top) / 2);
    }

    .dashboard-w {
        --sidebar-width: 4.5rem;
        width: calc(100vw - var(--sidebar-width));
    }
</style>

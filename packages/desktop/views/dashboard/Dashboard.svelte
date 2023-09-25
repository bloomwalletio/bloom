<script lang="ts">
    import { NavbarContainer } from '@components'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { IS_MAC, Platform } from '@core/app'
    import { clearLayer2TokensPoll, pollLayer2Tokens } from '@core/layer-2/actions'
    import {
        addNftsToDownloadQueue,
        downloadNextNftInQueue,
        interruptNftDownloadAfterTimeout,
    } from '@core/nfts/actions'
    import { downloadingNftId, nftDownloadQueue, resetNftDownloadQueue, selectedAccountNfts } from '@core/nfts/stores'
    import { logout, reflectLockedStronghold } from '@core/profile/actions'
    import { hasStrongholdLocked } from '@core/profile/stores'
    import { appRouter, dashboardRoute } from '@core/router'
    import features from '@features/features'
    import { Idle } from '@ui'
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'
    import Collectibles from './collectibles/Collectibles.svelte'
    import { Navbar, Sidebar } from './components'
    import { Developer } from './developer'
    import { DashboardDrawerRouterView } from './drawers'
    import { Governance } from './governance'
    import { Wallet } from './wallet'
    import { Settings } from './settings'
    import { OldWallet } from './old-wallet'

    const tabs = {
        wallet: Wallet,
        oldDashboard: OldWallet,
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

        Platform.DeepLinkManager.checkForDeepLinkRequest()

        void pollLayer2Tokens($selectedAccount)
    })

    onDestroy(() => {
        Platform.DeepLinkManager.clearDeepLinkRequest()
        clearLayer2TokensPoll()
    })
</script>

<Idle />
<dashboard class="dashboard-wrapper flex flex-row w-full h-full">
    <div class="flex flex-col flex-none">
        {#if IS_MAC}
            <NavbarContainer draggable={IS_MAC}>
                <div style:height="var(--windows-navbar-height)" />
            </NavbarContainer>
        {/if}
        <Sidebar />
    </div>
    <div class="flex flex-col flex-grow basis-0">
        <Navbar />
        <!-- Dashboard Pane -->
        <div>
            <svelte:component this={tabs[$dashboardRoute]} on:next={$appRouter.next} />
            <DashboardDrawerRouterView />
        </div>
    </div>
</dashboard>

<style lang="scss">
    :global(:not(body.platform-win32)) dashboard {
        margin-top: calc(env(safe-area-inset-top) / 2);
    }
</style>

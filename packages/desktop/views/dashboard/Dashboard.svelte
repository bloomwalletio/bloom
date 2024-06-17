<script lang="ts">
    import { NavbarContainer } from '@components'
    import { selectedAccountIndex } from '@core/account/stores'
    import { IS_MAC, Platform } from '@core/app'
    import { clearL2TokensPoll } from '@core/layer-2/actions'
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
    import { Navbar, DashboardSidebar } from './components'
    import { Developer } from './developer'
    import { DashboardDrawerRouterView } from './drawers'
    import { Governance } from './governance'
    import { Wallet } from './wallet'
    import { Settings } from '../settings'
    import { Background } from '@views/components'
    import { BuySell } from './buy-sell'
    import { CampaignsRouterView } from './campaigns'

    const tabs = {
        wallet: Wallet,
        settings: Settings,
        collectibles: Collectibles,
        governance: Governance,
        developer: Developer,
        buySell: BuySell,
        campaigns: CampaignsRouterView,
    }

    let previousAccountIndex = get(selectedAccountIndex)

    $: $hasStrongholdLocked && reflectLockedStronghold()

    $: $nftDownloadQueue, $downloadingNftId, downloadNextNftInQueue()
    $: interruptNftDownloadAfterTimeout(get(selectedAccountIndex), $downloadingNftId)
    $: addSelectedAccountNftsToDownloadQueue($selectedAccountIndex)

    $: if (features.analytics.dashboardRoute.enabled && $dashboardRoute)
        Platform.trackEvent('dashboard-route', { route: $dashboardRoute })

    function addSelectedAccountNftsToDownloadQueue(accountIndex: number): void {
        if (accountIndex !== previousAccountIndex) {
            previousAccountIndex = accountIndex
            resetNftDownloadQueue(true)
            void addNftsToDownloadQueue($selectedAccountNfts)
        }
    }

    onMount(() => {
        Platform.onEvent('menu-logout', () => {
            logout()
        })

        Platform.onEvent('lock-screen', () => {
            logout()
        })

        Platform.DeepLinkManager.checkForDeepLinkRequest()
    })

    onDestroy(() => {
        Platform.DeepLinkManager.clearDeepLinkRequest()
        clearL2TokensPoll()
    })
</script>

<Idle />
<Background />
<dashboard class="flex flex-row w-full h-full">
    <div class="flex flex-col flex-none z-10">
        {#if IS_MAC}
            <NavbarContainer draggable={IS_MAC}>
                <div style:height="var(--navbar-height, 0px)" />
            </NavbarContainer>
        {/if}
        <DashboardSidebar />
    </div>
    <div class="flex flex-col flex-grow basis-0 overflow-hidden">
        <Navbar />
        <!-- Dashboard Pane -->
        <dashboard-container>
            <svelte:component this={tabs[$dashboardRoute]} on:next={$appRouter.next} />
            <DashboardDrawerRouterView />
        </dashboard-container>
    </div>
</dashboard>

<style lang="postcss">
    :global(:not(body.platform-win32)) dashboard {
        margin-top: calc(env(safe-area-inset-top) / 2);
    }

    dashboard-container {
        height: calc(100vh - var(--navbar-height, 0px) - var(--windows-navbar-height, 0px));
    }
</style>

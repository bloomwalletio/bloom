<script lang="ts">
    import { Icon, Text } from '@ui'
    import { AccountSwitcher, NetworkDrawerButton, ConnectedDAppsButton } from '@components'
    import { localize } from '@core/i18n'
    import {
        collectiblesRoute,
        CollectiblesRoute,
        collectiblesRouter,
        dashboardRoute,
        DashboardRoute,
        governanceRoute,
        GovernanceRoute,
        governanceRouter,
    } from '@core/router'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { popupState } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { IS_WINDOWS } from '@core/app/constants'

    let isBackButtonVisible = false

    $: {
        if ($collectiblesRoute || $governanceRoute) {
            isBackButtonVisible = isCorrectRoute()
        }
    }
    $: isPopupVisible = $popupState?.active

    function isCorrectRoute(): boolean {
        switch ($dashboardRoute) {
            case DashboardRoute.Collectibles:
                return $collectiblesRoute !== CollectiblesRoute.Gallery
            case DashboardRoute.Governance:
                return $governanceRoute !== GovernanceRoute.Proposals
            default:
                break
        }
    }

    function onBackClick(): void {
        closeDrawer()
        switch ($dashboardRoute) {
            case DashboardRoute.Collectibles:
                $collectiblesRouter.previous()
                break
            case DashboardRoute.Governance:
                $governanceRouter.previous()
                break
            default:
                break
        }
    }
</script>

<top-navigation class:disabled={IS_WINDOWS && isPopupVisible} class:is-windows={IS_WINDOWS}>
    <div class="left-button" class:large={IS_WINDOWS}>
        {#if isBackButtonVisible}
            <button type="button" on:click={onBackClick}>
                <Icon width="18" icon={IconEnum.ArrowLeft} classes="text-gray-800 dark:text-gray-500" />
                <Text overrideColor classes="text-gray-800 dark:text-gray-500">{localize('actions.back')}</Text>
            </button>
        {/if}
    </div>

    <AccountSwitcher />

    <div class="right-button flex justify-end gap-2">
        {#if features?.wallet?.walletConnect?.enabled}
            <ConnectedDAppsButton />
        {/if}
        {#if features?.network?.config?.enabled}
            <NetworkDrawerButton />
        {/if}
    </div>
</top-navigation>

<style lang="scss">
    top-navigation {
        @apply absolute flex flex-row justify-between items-center z-10 -top-12 left-18 h-12 px-8 py-1;
        width: calc(100% - 4.5rem);

        &.disabled {
            @apply opacity-50 pointer-events-none;
        }

        &.is-windows {
            @apply pr-0;
            width: calc(100% - 15rem);
        }

        button {
            @apply flex items-center gap-2;
            -webkit-app-region: none;
        }

        .right-button {
            width: 10rem;
        }

        .left-button {
            width: 10rem;

            &.large {
                width: 19rem;
            }
        }
    }
</style>

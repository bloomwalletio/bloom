<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { IconButton, IconName } from '@bloomwalletio/ui'
    import { AccountSwitcher } from '@components'
    import { IS_WINDOWS } from '@core/app'
    import { localize } from '@core/i18n'
    import {
        CollectiblesRoute,
        DashboardRoute,
        GovernanceRoute,
        collectiblesRoute,
        collectiblesRouter,
        dashboardRoute,
        governanceRoute,
        governanceRouter,
    } from '@core/router'
    import { closeDrawer, toggleDashboardDrawer } from '@desktop/auxiliary/drawer'
    import { popupState } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { Icon, Text } from '@ui'
    import { DashboardDrawerRoute } from '../drawers'

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

<navbar class:disabled={isPopupVisible}>
    <div class="h-full flex flex-row justify-between items-center" class:drag={!IS_WINDOWS}>
        <div class="flex flex-row gap-2">
            {#if isBackButtonVisible}
                <button type="button" on:click={onBackClick}>
                    <Icon width="18" icon={IconEnum.ArrowLeft} classes="text-gray-800 dark:text-gray-500" />
                    <Text overrideColor classes="text-gray-800 dark:text-gray-500">{localize('actions.back')}</Text>
                </button>
            {/if}
            <AccountSwitcher />
        </div>

        <div class="right-button flex items-center justify-end gap-2">
            {#if features.contacts.enabled}
                <IconButton
                    on:click={() => toggleDashboardDrawer({ id: DashboardDrawerRoute.ContactBook })}
                    name={IconName.Users}
                    tooltip={localize('general.contacts')}
                    color="#1E1B4E"
                />
            {/if}
            {#if features?.wallet?.walletConnect?.enabled}
                <IconButton
                    on:click={() => toggleDashboardDrawer({ id: DashboardDrawerRoute.DappConfig })}
                    name={IconName.Grid}
                    tooltip={localize('general.apps')}
                    color="#1E1B4E"
                />
            {/if}
            {#if features?.network?.config?.enabled}
                <IconButton
                    on:click={() => toggleDashboardDrawer({ id: DashboardDrawerRoute.NetworkConfig })}
                    name={IconName.Globe}
                    tooltip={localize('general.networks')}
                    color="#1E1B4E"
                />
            {/if}
        </div>
    </div>
</navbar>

<style lang="scss">
    navbar {
        @apply w-full flex-none px-4 z-10 bg-white;
        height: 40px;
        border-bottom: 1px solid #f1eef9;

        &.disabled {
            @apply opacity-50 pointer-events-none;
        }

        button {
            @apply flex items-center gap-2;
            -webkit-app-region: none;
        }

        .drag {
            -webkit-app-region: drag;
            > * {
                -webkit-app-region: none;
            }
        }
    }
</style>

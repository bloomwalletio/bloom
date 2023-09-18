<script lang="ts">
    import { Icon, IconButton, IconName, Text } from '@bloomwalletio/ui'
    import { AccountSwitcher, NavbarContainer } from '@components'
    import { IS_MAC } from '@core/app'
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
    import features from '@features/features'
    import { DashboardDrawerRoute } from '../drawers'

    let isBackButtonVisible = false

    $: {
        if ($collectiblesRoute || $governanceRoute) {
            isBackButtonVisible = isCorrectRoute()
        }
    }

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

<NavbarContainer draggable={IS_MAC}>
    <div class="h-full flex flex-row justify-between items-center px-4">
        <div class="flex flex-row gap-2">
            {#if isBackButtonVisible}
                <IconButton
                    on:click={onBackClick}
                    icon={IconName.ArrowLeft}
                    tooltip={localize('actions.back')}
                    color="#1E1B4E"
                    size="sm"
                />
            {/if}
            <div class="flex flex-row space-x-2 items-center">
                <AccountSwitcher />
                <Icon name={IconName.ChevronRight} size="sm" />
                <Text size="sm" weight="semibold" color="#1E1B4E">
                    {localize(`tabs.${$dashboardRoute}`)}
                </Text>
                {#if $dashboardRoute === DashboardRoute.Collectibles && $collectiblesRoute !== CollectiblesRoute.Gallery}
                    <Icon name={IconName.ChevronRight} size="sm" />
                    <Text size="sm" weight="semibold" color="#1E1B4E">
                        {$collectiblesRoute}
                    </Text>
                {/if}
                {#if $dashboardRoute === DashboardRoute.Governance && $governanceRoute !== GovernanceRoute.Proposals}
                    <Icon name={IconName.ChevronRight} size="sm" />
                    <Text size="sm" weight="semibold" color="#1E1B4E">
                        {$governanceRoute}
                    </Text>
                {/if}
            </div>
        </div>

        <div class="right-button flex items-center justify-end gap-2">
            {#if features.contacts.enabled}
                <IconButton
                    on:click={() => toggleDashboardDrawer({ id: DashboardDrawerRoute.ContactBook })}
                    icon={IconName.Users}
                    tooltip={localize('general.contacts')}
                    color="#1E1B4E"
                    size="sm"
                />
            {/if}
            {#if features?.wallet?.walletConnect?.enabled}
                <IconButton
                    on:click={() => toggleDashboardDrawer({ id: DashboardDrawerRoute.DappConfig })}
                    icon={IconName.Grid}
                    tooltip={localize('general.apps')}
                    color="#1E1B4E"
                    size="sm"
                />
            {/if}
            {#if features?.network?.config?.enabled}
                <IconButton
                    on:click={() => toggleDashboardDrawer({ id: DashboardDrawerRoute.NetworkConfig })}
                    icon={IconName.Globe}
                    tooltip={localize('general.networks')}
                    color="#1E1B4E"
                    size="sm"
                />
            {/if}
        </div>
    </div>
</NavbarContainer>

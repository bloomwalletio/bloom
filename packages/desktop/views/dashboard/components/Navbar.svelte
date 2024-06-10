<script lang="ts">
    import { IconButton, IconName } from '@bloomwalletio/ui'
    import { NavbarContainer } from '@components'
    import { IS_MAC } from '@core/app'
    import { localize } from '@core/i18n'
    import { toggleDashboardDrawer } from '@desktop/auxiliary/drawer'
    import { DashboardDrawerRoute } from '../drawers'
    import Breadcrumbs from './Breadcrumbs.svelte'
    import NotificationsButton from '../notifications/NotificationsButton.svelte'
    import { isFeatureEnabled } from '@lib/features/utils'
</script>

<NavbarContainer draggable={IS_MAC}>
    <div class="flex flex-row justify-between items-center px-4" style:height="var(--navbar-height)">
        <Breadcrumbs />

        <div class="right-button flex items-center justify-end gap-2">
            {#if isFeatureEnabled('walletConnect.notifications')}
                <NotificationsButton />
            {/if}
            {#if isFeatureEnabled('contacts')}
                <IconButton
                    on:click={() => toggleDashboardDrawer({ id: DashboardDrawerRoute.ContactBook })}
                    icon={IconName.Users}
                    tooltip={localize('general.contacts')}
                    textColor="primary"
                    size="sm"
                />
            {/if}
            {#if isFeatureEnabled('walletConnect.web3Wallet')}
                <IconButton
                    on:click={() => toggleDashboardDrawer({ id: DashboardDrawerRoute.DappConfig })}
                    icon={IconName.Grid}
                    tooltip={localize('general.connectedDapps')}
                    textColor="primary"
                    size="sm"
                />
            {/if}
            {#if isFeatureEnabled('network.config')}
                <IconButton
                    on:click={() => toggleDashboardDrawer({ id: DashboardDrawerRoute.NetworkConfig })}
                    icon={IconName.Globe}
                    tooltip={localize('general.networks')}
                    textColor="primary"
                    size="sm"
                />
            {/if}
        </div>
    </div>
</NavbarContainer>

<style lang="scss">
    :global(:root) {
        --navbar-height: 40px;
    }
</style>

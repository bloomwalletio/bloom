<script lang="ts">
    import { IconButton, IconName } from '@bloomwalletio/ui'
    import { NavbarContainer } from '@components'
    import { IS_MAC } from '@core/app'
    import { localize } from '@core/i18n'
    import { toggleDashboardDrawer } from '@desktop/auxiliary/drawer'
    import features from '@features/features'
    import { DashboardDrawerRoute } from '../drawers'
    import Breadcrumbs from './Breadcrumbs.svelte'
    import { style } from '@core/utils/ui'
</script>

<NavbarContainer draggable={IS_MAC}>
    <div class="flex flex-row justify-between items-center px-4" use:style={{ height: 'var(--navbar-height, 0px)' }}>
        <Breadcrumbs />

        <div class="right-button flex items-center justify-end gap-2">
            {#if features.contacts.enabled}
                <IconButton
                    on:click={() => toggleDashboardDrawer({ id: DashboardDrawerRoute.ContactBook })}
                    icon={IconName.Users}
                    tooltip={localize('general.contacts')}
                    textColor="primary"
                    size="sm"
                />
            {/if}
            {#if features?.walletConnect?.enabled}
                <IconButton
                    on:click={() => toggleDashboardDrawer({ id: DashboardDrawerRoute.DappConfig })}
                    icon={IconName.Grid}
                    tooltip={localize('general.apps')}
                    textColor="primary"
                    size="sm"
                />
            {/if}
            {#if features?.network?.config?.enabled}
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

<script lang="ts">
    import { Icon } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { DappConfigRoute } from '../dapp-config-route.enum'

    export let drawerRouter: Router<DappConfigRoute>

    function onConnectDappClick(): void {
        openPopup({
            id: PopupId.InitWalletConnect,
        })
    }
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.dApps.dAppsList.title')} {drawerRouter}>
    <connected-dapps-drawer class="h-full flex flex-col justify-between">
        <div class="flex flex-col gap-4">
            <!-- add list here -->
        </div>
    </connected-dapps-drawer>

    <button
        type="button"
        class="flex flex-row items-center justify-center w-full space-x-2 bg-transparent text-blue-500 px-8 py-3 text-15 rounded-lg"
        slot="footer"
        on:click|stopPropagation={onConnectDappClick}
    >
        <Icon icon={IconEnum.Plus} height={12} />
        {localize('views.dashboard.drawers.dApps.dAppsList.connectDapp')}
    </button>
</DrawerTemplate>

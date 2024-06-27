<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account/interfaces'
    import { getAddressFromAccountForNetwork } from '@core/account/utils'
    import { openUrlInBrowser } from '@core/app/utils'
    import { localize } from '@core/i18n'
    import {
        ExplorerEndpoint,
        getExplorerUrl,
        Network,
        NetworkNamespace,
        setSelectedNetworkForNetworkDrawer,
    } from '@core/network'
    import { setClipboard } from '@core/utils/os'
    import { toggleDashboardDrawer } from '@desktop/auxiliary/drawer'
    import { PopupId } from '@desktop/auxiliary/popup'
    import { openPopup } from '@desktop/auxiliary/popup/actions'
    import { DashboardDrawerRoute, NetworkConfigRoute } from '@views/dashboard/drawers'

    export let network: Network
    export let account: IAccountState

    let address: string | undefined
    $: address = getAddressFromAccountForNetwork(account, network.id)

    function onCopyClick(): void {
        if (!address) {
            return
        }
        setClipboard(address)
    }

    function onExplorerClick(): void {
        if (!address) {
            return
        }
        const url = getExplorerUrl(network.id, ExplorerEndpoint.Address, address)
        openUrlInBrowser(url)
    }

    function onSyncAccountsClick(): void {
        openPopup({ id: PopupId.SyncAccounts })
        menu?.close()
    }

    function onViewBalanceClick(): void {
        openPopup({ id: PopupId.BalanceBreakdown })
        menu?.close()
    }

    function onSettingsClick(): void {
        setSelectedNetworkForNetworkDrawer(network)
        toggleDashboardDrawer({
            id: DashboardDrawerRoute.NetworkConfig,
            initialSubroute: NetworkConfigRoute.ChainInformation,
        })
    }

    let menu: Menu | undefined = undefined
    $: menuItems = [
        {
            icon: IconName.Copy,
            title: localize('actions.copyAddress'),
            onClick: onCopyClick,
        },
        {
            icon: IconName.Globe,
            title: localize('general.viewOnExplorer'),
            onClick: onExplorerClick,
        },
        ...(network.namespace === NetworkNamespace.Stardust
            ? [
                  {
                      icon: IconName.Refresh,
                      title: localize('actions.syncAccounts'),
                      onClick: onSyncAccountsClick,
                  },
                  {
                      icon: IconName.PieChart,
                      title: localize('general.balanceBreakdown'),
                      onClick: onViewBalanceClick,
                  },
              ]
            : []),
        {
            icon: IconName.Settings,
            title: localize('general.networkSettings'),
            onClick: onSettingsClick,
        },
    ]
</script>

<Menu bind:this={menu} items={menuItems} />

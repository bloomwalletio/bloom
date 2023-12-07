import { validateConnectionCodeUri } from '@auxiliary/wallet-connect/utils'
import { pairWithNewDapp } from '@auxiliary/wallet-connect/actions'
import { toggleDashboardDrawer } from '../../../../../../../../desktop/lib/auxiliary/drawer'
import { DashboardDrawerRoute } from '../../../../../../../../desktop/views/dashboard/drawers/dashboard-drawer-route.enum'
import { DappConfigRoute } from '../../../../../../../../desktop/views/dashboard/drawers/dapp-config/dapp-config-route.enum'

export function handleDeepLinkAddWCConnectionOperation(searchParams: URLSearchParams): void {
    const walletConnectUri = searchParams.get('uri')

    try {
        if (!walletConnectUri) throw new Error('No wallet connect URI provided')
        validateConnectionCodeUri(walletConnectUri)

        pairWithNewDapp(walletConnectUri)

        toggleDashboardDrawer({
            id: DashboardDrawerRoute.DappConfig,
            initialSubroute: DappConfigRoute.ConfirmConnection,
        })
    } catch (err) {
        toggleDashboardDrawer({
            id: DashboardDrawerRoute.DappConfig,
            initialSubroute: DappConfigRoute.InputCode,
            props: { initialWalletConnectUri: walletConnectUri },
        })
    }
}

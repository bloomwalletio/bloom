import { pairWithNewDapp } from '@auxiliary/wallet-connect/actions'
import { rejectAndClearSessionInitiationRequest, validateConnectionCodeUri } from '@auxiliary/wallet-connect/utils'
import { get } from 'svelte/store'
import { DrawerRoute, openDrawer } from '../../../../../../../../desktop/lib/auxiliary/drawer'
import { dappConfigRouter } from '../../../../../../../../desktop/views/dashboard/drawers/dapp-config/dapp-config.router'
import { DappConfigRoute } from '../../../../../../../../desktop/views/dashboard/drawers/dapp-config/dapp-config-route.enum'
import { DashboardDrawerRoute } from '../../../../../../../../desktop/views/dashboard/drawers/dashboard-drawer-route.enum'

export function handleDeepLinkAddWCConnectionOperation(searchParams: URLSearchParams): void {
    const walletConnectUri = searchParams.get('uri')
    const $dappConfigRouter = get(dappConfigRouter)

    try {
        if (!walletConnectUri) {
            throw new Error('No wallet connect URI provided')
        }
        validateConnectionCodeUri(walletConnectUri)

        pairWithNewDapp(walletConnectUri)

        $dappConfigRouter?.reset()
        $dappConfigRouter?.goTo(DappConfigRoute.ConnectionRequest)
        openDrawer({
            route: DrawerRoute.Dashboard,
            id: DashboardDrawerRoute.DappConfig,
            initialSubroute: DappConfigRoute.ConnectionRequest,
            props: {
                onClose: () => void rejectAndClearSessionInitiationRequest(),
            },
        })
    } catch (err) {
        $dappConfigRouter?.reset()
        $dappConfigRouter?.goTo(DappConfigRoute.InputCode)
        openDrawer({
            route: DrawerRoute.Dashboard,
            id: DashboardDrawerRoute.DappConfig,
            initialSubroute: DappConfigRoute.InputCode,
            props: { initialWalletConnectUri: walletConnectUri },
        })
    }
}

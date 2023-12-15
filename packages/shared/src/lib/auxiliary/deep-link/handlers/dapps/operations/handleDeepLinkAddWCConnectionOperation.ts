import { pairWithNewDapp } from '@auxiliary/wallet-connect/actions'
import { rejectSession, validateConnectionCodeUri } from '@auxiliary/wallet-connect/utils'
import { get } from 'svelte/store'
import { toggleDashboardDrawer } from '../../../../../../../../desktop/lib/auxiliary/drawer'
import { dappConfigRouter } from '../../../../../../../../desktop/views/dashboard/drawers'
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
        toggleDashboardDrawer({
            id: DashboardDrawerRoute.DappConfig,
            initialSubroute: DappConfigRoute.ConnectionRequest,
            props: { onClose: rejectSession },
        })
    } catch (err) {
        $dappConfigRouter?.reset()
        $dappConfigRouter?.goTo(DappConfigRoute.InputCode)
        toggleDashboardDrawer({
            id: DashboardDrawerRoute.DappConfig,
            initialSubroute: DappConfigRoute.InputCode,
            props: { initialWalletConnectUri: walletConnectUri },
        })
    }
}

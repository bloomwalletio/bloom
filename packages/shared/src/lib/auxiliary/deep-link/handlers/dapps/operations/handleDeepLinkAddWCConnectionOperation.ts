import { validateConnectionCodeUri } from '@auxiliary/wallet-connect/utils'
import { pairWithNewDapp } from '@auxiliary/wallet-connect/actions'
import { toggleDashboardDrawer } from '../../../../../../../../desktop/lib/auxiliary/drawer'
import { DappConfigRoute, DashboardDrawerRoute } from '../../../../../../../../desktop/views/dashboard/drawers'
import { isValidWalletConnectVersion } from '@auxiliary/wallet-connect/utils/isValidWalletConnectVersion'

export function handleDeepLinkAddWCConnectionOperation(pathnameParts: string[], searchString: string): void {
    const walletConnectUri = pathnameParts[1] + searchString

    try {
        validateConnectionCodeUri(walletConnectUri)
        if (!isValidWalletConnectVersion(walletConnectUri)) {
            throw Error()
        }

        pairWithNewDapp(walletConnectUri)

        toggleDashboardDrawer({
            id: DashboardDrawerRoute.DappConfig,
            initialSubRoute: DappConfigRoute.ConfirmConnection,
        })
    } catch (err) {
        toggleDashboardDrawer({
            id: DashboardDrawerRoute.DappConfig,
            initialSubRoute: DappConfigRoute.InputCode,
            props: { initialWalletConnectUri: walletConnectUri },
        })
    }
}

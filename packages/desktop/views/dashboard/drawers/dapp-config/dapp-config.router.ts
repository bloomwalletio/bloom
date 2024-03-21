import { get, writable } from 'svelte/store'
import { Router } from '@core/router'
import { DappConfigRoute } from './dapp-config-route.enum'

export const dappConfigRoute = writable<DappConfigRoute>(undefined)
export const dappConfigRouter = writable<DappConfigRouter>(undefined)

export class DappConfigRouter extends Router<DappConfigRoute> {
    constructor(initialRoute: DappConfigRoute = DappConfigRoute.ConnectedDapps) {
        super(initialRoute, dappConfigRoute)
    }

    next(): void {
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case DappConfigRoute.ConnectedDapps:
                return
            case DappConfigRoute.InputCode:
                this.setNext(DappConfigRoute.ConnectionRequest)
                break
            case DappConfigRoute.ConnectionRequest:
                this.setNext(DappConfigRoute.ConfirmConnection)
                break
            case DappConfigRoute.ConfirmConnection:
                return
        }
    }
}

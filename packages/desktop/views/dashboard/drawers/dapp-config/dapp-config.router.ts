import { get, writable } from 'svelte/store'
import { Router } from '@core/router'
import { DappConfigRoute } from './dapp-config-route.enum'

export const dappConfigRoute = writable<DappConfigRoute | null>(null)
export const dappConfigRouter = writable<DappConfigRouter | null>(null)

export class DappConfigRouter extends Router<DappConfigRoute> {
    constructor() {
        super(DappConfigRoute.ConnectedDapps, dappConfigRoute)
    }

    next(): void {
        let nextRoute: DappConfigRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case DappConfigRoute.ConnectedDapps:
                return
            case DappConfigRoute.InputCode:
                nextRoute = DappConfigRoute.ConfirmConnection
                break
            case DappConfigRoute.ConfirmConnection:
                return
        }

        this.setNext(nextRoute)
    }
}

import { Router } from '@core/router'
import { get, writable } from 'svelte/store'
import { ConnectedDappsDrawerRoute } from './connected-dapps-route.enum'

export const connectedDappsDrawerRoute = writable<ConnectedDappsDrawerRoute>(undefined)
export const connectedDappsDrawerRouter = writable<ConnectedDappsDrawerRouter>(undefined)

export class ConnectedDappsDrawerRouter extends Router<ConnectedDappsDrawerRoute> {
    constructor(initialRoute: ConnectedDappsDrawerRoute) {
        super(initialRoute, connectedDappsDrawerRoute)
    }

    next(): void {
        let nextRoute: ConnectedDappsDrawerRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ConnectedDappsDrawerRoute.List:
                return
        }

        this.setNext(nextRoute)
    }
}

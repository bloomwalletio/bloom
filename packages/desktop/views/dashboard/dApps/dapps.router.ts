import { Router } from '@core/router'
import { get, writable } from 'svelte/store'
import { DAppsDrawerRoute } from './dapps-route.enum'

export const dAppsDrawerRoute = writable<DAppsDrawerRoute>(undefined)
export const dAppsDrawerRouter = writable<DAppsDrawerRouter>(undefined)

export class DAppsDrawerRouter extends Router<DAppsDrawerRoute> {
    constructor(initialRoute: DAppsDrawerRoute) {
        super(initialRoute, dAppsDrawerRoute)
    }

    next(): void {
        let nextRoute: DAppsDrawerRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case DAppsDrawerRoute.List:
                return
        }

        this.setNext(nextRoute)
    }
}

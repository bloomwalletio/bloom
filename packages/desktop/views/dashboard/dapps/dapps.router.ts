import { Router } from '@core/router'
import { get, writable } from 'svelte/store'
import { DappsDrawerRoute } from './dapps-route.enum'

export const dappsDrawerRoute = writable<DappsDrawerRoute>(undefined)
export const dappsDrawerRouter = writable<DappsDrawerRouter>(undefined)

export class DappsDrawerRouter extends Router<DappsDrawerRoute> {
    constructor(initialRoute: DappsDrawerRoute) {
        super(initialRoute, dappsDrawerRoute)
    }

    next(): void {
        let nextRoute: DappsDrawerRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case DappsDrawerRoute.List:
                return
        }

        this.setNext(nextRoute)
    }
}

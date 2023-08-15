import { writable } from 'svelte/store'
import { Router } from '@core/router'
import { DappsDrawerRoute } from './dapps-route.enum'

export const dappsDrawerRoute = writable<DappsDrawerRoute | null>(null)
export const dappsDrawerRouter = writable<DappsDrawerRouter | null>(null)

export class DappsDrawerRouter extends Router<DappsDrawerRoute> {
    constructor() {
        super(DappsDrawerRoute.ConnectedDapps, dappsDrawerRoute)
    }
}

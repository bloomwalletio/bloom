import { writable } from 'svelte/store'
import { Router } from '@core/router'
import { DappConfigRoute } from './dapp-config-route.enum'

export const dappConfigRoute = writable<DappConfigRoute | null>(null)
export const dappConfigRouter = writable<DappConfigRouter | null>(null)

export class DappConfigRouter extends Router<DappConfigRoute> {
    constructor() {
        super(DappConfigRoute.ConnectedDapps, dappConfigRoute)
    }
}

import { writable } from 'svelte/store'
import { Router } from '@core/router'
import { NetworkConfigRoute } from './network-config-route.enum'

export const networkConfigRoute = writable<NetworkConfigRoute>(null)
export const networkConfigRouter = writable<NetworkConfigRouter>(null)

export class NetworkConfigRouter extends Router<NetworkConfigRoute> {
    constructor(initialRoute = NetworkConfigRoute.ConnectedChains) {
        super(initialRoute, networkConfigRoute)
    }
}

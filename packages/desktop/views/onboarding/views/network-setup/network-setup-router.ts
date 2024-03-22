import { onboardingProfile } from '@contexts/onboarding/stores'
import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { NetworkSetupRoute } from './network-setup-route.enum'

export const networkSetupRoute = writable<NetworkSetupRoute>(undefined)
export const networkSetupRouter = writable<NetworkSetupRouter>(undefined)

export class NetworkSetupRouter extends Subrouter<NetworkSetupRoute> {
    constructor(parentRouter: Router<unknown>) {
        super(NetworkSetupRoute.ChooseNetwork, networkSetupRoute, parentRouter)
    }

    next(): void {
        const _onboardingProfile = get(onboardingProfile)
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case NetworkSetupRoute.ChooseNetwork: {
                const network = _onboardingProfile?.network
                if (network) {
                    this.parentRouter?.next()
                    return
                } else {
                    this.setNext(NetworkSetupRoute.CustomNetwork)
                    break
                }
            }
            case NetworkSetupRoute.CustomNetwork:
                this.parentRouter?.next()
                return
        }
    }
}

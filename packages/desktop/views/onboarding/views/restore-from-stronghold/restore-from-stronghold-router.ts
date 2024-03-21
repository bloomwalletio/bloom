import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { RestoreFromStrongholdRoute } from './restore-from-stronghold-route.enum'
import { onboardingProfile } from '@contexts/onboarding/stores'
import { isLatestStrongholdVersion } from '@core/app/utils'
import { UpdateStrongholdRouter, updateStrongholdRouter } from '@views/update-stronghold'

export const restoreFromStrongholdRoute = writable<RestoreFromStrongholdRoute>(undefined)
export const restoreFromStrongholdRouter = writable<RestoreFromStrongholdRouter>(undefined)

export class RestoreFromStrongholdRouter extends Subrouter<RestoreFromStrongholdRoute> {
    constructor(parentRouter: Router<unknown>) {
        super(RestoreFromStrongholdRoute.ImportStronghold, restoreFromStrongholdRoute, parentRouter)
    }

    next(): void {
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case RestoreFromStrongholdRoute.ImportStronghold:
                if (isLatestStrongholdVersion(get(onboardingProfile)?.strongholdVersion)) {
                    this.setNext(RestoreFromStrongholdRoute.UnlockBackup)
                } else {
                    updateStrongholdRouter.set(new UpdateStrongholdRouter(this))
                    this.setNext(RestoreFromStrongholdRoute.UpdateStronghold)
                }
                break
            case RestoreFromStrongholdRoute.UnlockBackup:
            case RestoreFromStrongholdRoute.UpdateStronghold:
                this.parentRouter?.next()
                return
        }
    }
}

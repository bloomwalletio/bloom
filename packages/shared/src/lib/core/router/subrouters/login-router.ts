import { isLatestStrongholdVersion } from '@core/app'
import { ProfileType } from '@core/profile'
import { activeProfile } from '@core/profile/stores'
import features from '@features/features'
import { get, writable } from 'svelte/store'
import {
    UpdateStrongholdRouter,
    updateStrongholdRouter,
} from '../../../../../../desktop/views/update-stronghold/update-stronghold-router'
import { Subrouter } from '../classes'
import { LoginRoute } from '../enums'
import { appRouter } from '../routers'

export const loginRoute = writable<LoginRoute>(undefined)
export const loginRouter = writable<LoginRouter>(undefined)

export class LoginRouter extends Subrouter<LoginRoute> {
    constructor() {
        super(LoginRoute.SelectProfile, loginRoute, get(appRouter))
    }

    next(params?: Record<string, unknown>): void {
        const currentRoute = get(this.routeStore)

        const requiresUpdate =
            get(activeProfile) &&
            get(activeProfile).type === ProfileType.Software &&
            !isLatestStrongholdVersion(get(activeProfile)?.strongholdVersion) &&
            features.onboarding.strongholdVersionCheck.enabled

        switch (currentRoute) {
            case LoginRoute.SelectProfile: {
                if (params?.shouldAddProfile) {
                    this.parentRouter?.next(params)
                    return
                } else {
                    this.setNext(LoginRoute.EnterPin)
                }
                break
            }
            case LoginRoute.EnterPin:
                if (requiresUpdate) {
                    updateStrongholdRouter.set(new UpdateStrongholdRouter(this))
                    this.setNext(LoginRoute.UpdateStronghold)
                } else {
                    this.setNext(LoginRoute.LoadProfile)
                }
                break
            case LoginRoute.UpdateStronghold:
                this.setNext(LoginRoute.LoadProfile)
                break
            case LoginRoute.LoadProfile:
                this.parentRouter?.next(params)
                return
        }
    }
}

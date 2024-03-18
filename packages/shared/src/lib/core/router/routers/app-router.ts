import { get, writable } from 'svelte/store'

import { profiles } from '@core/profile/stores'

import { Router } from '../classes'
import { AppRoute, LoginRoute } from '../enums'
import { IRouterEvent } from '../interfaces'
import { loginRoute } from '../subrouters'

export const appRoute = writable<AppRoute>(undefined)
export const appRouter = writable<AppRouter>(undefined)

export class AppRouter extends Router<AppRoute> {
    constructor() {
        super(AppRoute.Onboarding, appRoute)
        this.init()
    }

    public init(): void {
        this.routeStore.set(get(profiles).length > 0 ? AppRoute.Login : AppRoute.Onboarding)
    }

    public reset(): void {
        this.history = []
        this.init()
    }

    public next(event?: IRouterEvent): void {
        const params = event || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case AppRoute.Login: {
                if (params.shouldAddProfile) {
                    this.setNext(AppRoute.Onboarding)
                } else {
                    this.setNext(AppRoute.Dashboard)
                }
                break
            }
            case AppRoute.Dashboard: {
                if (params.reset) {
                    this.setNext(AppRoute.Login)
                }
                break
            }
            case AppRoute.Onboarding: {
                if (params.shouldAddProfile) {
                    this.setNext(AppRoute.Onboarding)
                } else {
                    loginRoute.set(LoginRoute.LoadProfile)
                    this.setNext(AppRoute.Login)
                }
                break
            }
        }
    }

    public forceNextRoute(route: AppRoute): void {
        this.setNext(route)
    }
}

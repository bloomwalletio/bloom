import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { CompleteOnboardingRoute } from './complete-onboarding-route.enum'

export const completeOnboardingRoute = writable<CompleteOnboardingRoute | undefined>(undefined)
export const completeOnboardingRouter = writable<CompleteOnboardingRouter | undefined>(undefined)

export class CompleteOnboardingRouter extends Subrouter<CompleteOnboardingRoute> {
    constructor(parentRouter: Router<unknown>) {
        super(CompleteOnboardingRoute.EnterName, completeOnboardingRoute, parentRouter)
    }

    next(): void {
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case CompleteOnboardingRoute.EnterName:
                this.setNext(CompleteOnboardingRoute.EnterPin)
                break
            case CompleteOnboardingRoute.EnterPin:
                this.setNext(CompleteOnboardingRoute.FinishOnboarding)
                break
            case CompleteOnboardingRoute.FinishOnboarding:
                this.parentRouter?.next()
                return
        }
    }
}

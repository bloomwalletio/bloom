import { OnboardingType, onboardingProfile } from '@contexts/onboarding'
import { profiles } from '@core/profile/stores'
import { Router } from '@core/router/classes'
import { appRouter } from '@core/router/routers/app-router'
import { get, writable } from 'svelte/store'
import { OnboardingRoute } from './onboarding-route.enum'
import { CompleteOnboardingRouter, completeOnboardingRouter } from './views/complete-onboarding'
import { CreateProfileRouter, createProfileRouter } from './views/create-profile'
import { NetworkSetupRouter, networkSetupRouter } from './views/network-setup'
import { RestoreProfileRouter, restoreProfileRouter } from './views/restore-profile'

export const onboardingRoute = writable<OnboardingRoute>(undefined)
export const onboardingRouter = writable<OnboardingRouter>(undefined)

export class OnboardingRouter extends Router<OnboardingRoute> {
    constructor() {
        super(getInitialRoute(), onboardingRoute)
        networkSetupRouter.set(new NetworkSetupRouter(this))
    }

    next(): void {
        let nextRoute: OnboardingRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case OnboardingRoute.Welcome: {
                nextRoute = OnboardingRoute.NetworkSetup
                break
            }
            case OnboardingRoute.NetworkSetup: {
                nextRoute = OnboardingRoute.ChooseOnboardingFlow
                break
            }
            case OnboardingRoute.ChooseOnboardingFlow: {
                switch (get(onboardingProfile)?.onboardingType) {
                    case OnboardingType.Create: {
                        createProfileRouter.set(new CreateProfileRouter(get(onboardingRouter)))
                        nextRoute = OnboardingRoute.CreateProfile
                        break
                    }
                    case OnboardingType.Restore:
                    case OnboardingType.Claim:
                        restoreProfileRouter.set(new RestoreProfileRouter(get(onboardingRouter)))
                        nextRoute = OnboardingRoute.RestoreProfile
                        break
                }
                break
            }
            case OnboardingRoute.CreateProfile:
            case OnboardingRoute.RestoreProfile: {
                completeOnboardingRouter.set(new CompleteOnboardingRouter(get(onboardingRouter)))
                nextRoute = OnboardingRoute.CompleteOnboarding
                break
            }
            case OnboardingRoute.CompleteOnboarding: {
                get(appRouter).next()
                return
            }
        }

        this.setNext(nextRoute)
    }

    previous(): void {
        if (this.history.length > 0) {
            super.previous()
        } else {
            get(appRouter).previous()
        }
    }
}

function getInitialRoute(): OnboardingRoute {
    if (get(profiles).length > 0) {
        return OnboardingRoute.NetworkSetup
    } else {
        return OnboardingRoute.Welcome
    }
}

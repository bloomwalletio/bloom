import {
    appRouter,
    AppRouter,
    collectiblesRouter,
    CollectiblesRouter,
    DashboardRouter,
    dashboardRouter,
    GovernanceRouter,
    governanceRouter,
    SettingsRouter,
    settingsRouter,
} from '@core/router/routers'
import { loginRouter, LoginRouter } from '@core/router/subrouters'
import { CampaignsRouter, campaignsRouter } from '@views/dashboard/campaigns'
import { OnboardingRouter, onboardingRouter } from '@views/onboarding'

export function initialiseRouters(): void {
    /**
     * CAUTION: It is important that subrouters are initialized
     * AFTER the base routers, since each subrouter relies on the
     * its parent router's store during construction.
     */
    initialiseBaseRouters()
    initialiseSubrouters()
}

export function initialiseOnboardingRouters(): void {
    initialiseBaseOnboardingRouters()
}

function initialiseBaseRouters(): void {
    appRouter.set(new AppRouter())
    dashboardRouter.set(new DashboardRouter())
    settingsRouter.set(new SettingsRouter())
    collectiblesRouter.set(new CollectiblesRouter())
    campaignsRouter.set(new CampaignsRouter())
    governanceRouter.set(new GovernanceRouter())
    campaignsRouter.set(new CampaignsRouter())
    initialiseBaseOnboardingRouters()
}

function initialiseBaseOnboardingRouters(): void {
    onboardingRouter.set(new OnboardingRouter())
}

function initialiseSubrouters(): void {
    loginRouter.set(new LoginRouter())
}

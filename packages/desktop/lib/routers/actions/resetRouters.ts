import { appRouter, collectiblesRouter, dashboardRouter, governanceRouter, loginRouter } from '@core/router'
import { onboardingRouter } from '@views/onboarding'
import { get } from 'svelte/store'

export function resetRouters(): void {
    resetSubrouters()
    resetBaseRouters()
}

function resetSubrouters(): void {
    get(loginRouter).reset()
}

function resetBaseRouters(): void {
    // Settings.svelte handles resetting the setting router
    get(appRouter)?.reset()
    get(dashboardRouter)?.reset()
    get(onboardingRouter)?.reset()
    get(collectiblesRouter)?.reset()
    get(governanceRouter)?.reset()
}

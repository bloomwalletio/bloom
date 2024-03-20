import { AppContext } from '@core/app'
import { AppRoute } from '@core/router'

export function getAppRouteForContext(context: AppContext): AppRoute | undefined {
    switch (context) {
        case AppContext.Dashboard:
            return AppRoute.Dashboard
        case AppContext.Login:
            return AppRoute.Login
        case AppContext.Onboarding:
            return AppRoute.Onboarding
        default:
            return undefined
    }
}

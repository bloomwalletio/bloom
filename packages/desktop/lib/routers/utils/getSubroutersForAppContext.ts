import { AppContext } from '@core/app/enums'
import { IRouter } from '@core/router/interfaces'
import { updateStrongholdRouter } from '@views/update-stronghold'
import { get } from 'svelte/store'

export function getSubroutersForAppContext(context: AppContext): IRouter[] {
    switch (context) {
        case AppContext.Dashboard:
            return []
        case AppContext.Login: {
            const subrouter = get(updateStrongholdRouter)
            return subrouter ? [subrouter] : []
        }
        case AppContext.Onboarding:
            return []
        case AppContext.Settings:
            return []
        default:
            return []
    }
}

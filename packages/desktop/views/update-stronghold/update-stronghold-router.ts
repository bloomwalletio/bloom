import { Subrouter } from '@core/router/classes'
import { IRouter } from '@core/router/interfaces'
import { get, writable } from 'svelte/store'
import { UpdateStrongholdRoute } from './update-stronghold-route.enum'

export const updateStrongholdRoute = writable<UpdateStrongholdRoute | undefined>(undefined)
export const updateStrongholdRouter = writable<UpdateStrongholdRouter | undefined>(undefined)

export class UpdateStrongholdRouter extends Subrouter<UpdateStrongholdRoute> {
    constructor(parentRouter: IRouter) {
        super(UpdateStrongholdRoute.Update, updateStrongholdRoute, parentRouter)
    }

    next(): void {
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case UpdateStrongholdRoute.Update:
                this.setNext(UpdateStrongholdRoute.ChangePassword)
                break
            case UpdateStrongholdRoute.ChangePassword:
                this.setNext(UpdateStrongholdRoute.SaveBackup)
                break
            case UpdateStrongholdRoute.SaveBackup:
                this.parentRouter?.next()
                return
        }
    }
}

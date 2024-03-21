import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { CreateFromMnemonicRoute } from './create-from-mnemonic-route.enum'

export const createFromMnemonicRoute = writable<CreateFromMnemonicRoute>(undefined)
export const createFromMnemonicRouter = writable<CreateFromMnemonicRouter>(undefined)

export class CreateFromMnemonicRouter extends Subrouter<CreateFromMnemonicRoute> {
    constructor(parentRouter: Router<unknown>) {
        super(CreateFromMnemonicRoute.ViewMnemonic, createFromMnemonicRoute, parentRouter)
    }

    next(): void {
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case CreateFromMnemonicRoute.ViewMnemonic:
                this.setNext(CreateFromMnemonicRoute.VerifyMnemonic)
                break
            case CreateFromMnemonicRoute.VerifyMnemonic:
                this.setNext(CreateFromMnemonicRoute.VerifyMnemonicSuccess)
                break
            case CreateFromMnemonicRoute.VerifyMnemonicSuccess:
                this.setNext(CreateFromMnemonicRoute.EncryptMnemonic)
                break
            case CreateFromMnemonicRoute.EncryptMnemonic:
                this.parentRouter?.next()
                return
        }
    }
}

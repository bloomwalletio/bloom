import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { SendFlowRoute } from './send-flow-route.enum'
import { NewTransactionType, newTransactionDetails } from '@core/wallet'

export const sendFlowRoute = writable<SendFlowRoute>(undefined)
export const sendFlowRouter = writable<SendFlowRouter>(undefined)

export class SendFlowRouter extends Subrouter<SendFlowRoute> {
    constructor(parentRouter: Router<unknown>, initialRoute: SendFlowRoute = SendFlowRoute.SelectToken) {
        if (
            get(newTransactionDetails)?.type === NewTransactionType.NftTransfer &&
            initialRoute === SendFlowRoute.SelectToken
        ) {
            initialRoute = SendFlowRoute.SelectRecipient
        }
        super(initialRoute, sendFlowRoute, parentRouter)
    }

    next(): void {
        let nextRoute: SendFlowRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case SendFlowRoute.SelectToken:
                nextRoute = SendFlowRoute.SelectRecipient
                break
            case SendFlowRoute.SelectRecipient:
                if (get(newTransactionDetails)?.type === NewTransactionType.NftTransfer) {
                    nextRoute = SendFlowRoute.TransactionSummary
                } else {
                    nextRoute = SendFlowRoute.InputTokenAmount
                }
                break
            case SendFlowRoute.InputTokenAmount:
                nextRoute = SendFlowRoute.TransactionSummary
                break
            case SendFlowRoute.TransactionSummary:
                return
        }

        this.setNext(nextRoute)
    }
}

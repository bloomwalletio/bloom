import { appRouter, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { SendFlowRoute } from './send-flow-route.enum'
import { SendFlowType, sendFlowParameters } from '@core/wallet'

export const sendFlowRoute = writable<SendFlowRoute>(undefined)
export const sendFlowRouter = writable<SendFlowRouter>(undefined)

export class SendFlowRouter extends Subrouter<SendFlowRoute> {
    constructor(initialRoute: SendFlowRoute = SendFlowRoute.SelectToken) {
        if (get(sendFlowParameters)?.type === SendFlowType.NftTransfer && initialRoute === SendFlowRoute.SelectToken) {
            initialRoute = SendFlowRoute.SelectRecipient
        }
        super(initialRoute, sendFlowRoute, get(appRouter))
    }

    next(): void {
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case SendFlowRoute.SelectToken:
                this.setNext(SendFlowRoute.SelectRecipient)
                break
            case SendFlowRoute.SelectRecipient:
                if (get(sendFlowParameters)?.type === SendFlowType.NftTransfer) {
                    this.setNext(SendFlowRoute.TransactionSummary)
                } else {
                    this.setNext(SendFlowRoute.InputTokenAmount)
                }
                break
            case SendFlowRoute.InputTokenAmount:
                this.setNext(SendFlowRoute.TransactionSummary)
                break
            case SendFlowRoute.TransactionSummary:
                return
        }
    }
}

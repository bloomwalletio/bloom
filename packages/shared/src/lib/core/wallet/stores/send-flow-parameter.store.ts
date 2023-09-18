import { writable, Writable } from 'svelte/store'
import { SendFlowType } from '../enums'
import type { SendFlowParameters } from '../types'

export const sendFlowParameters: Writable<SendFlowParameters | undefined> = writable(undefined)

export function setSendFlowParameters(payload: SendFlowParameters): void {
    sendFlowParameters.set(payload)
}

export function resetSendFlowParameters(): void {
    sendFlowParameters.set(undefined)
}

export function updateSendFlowParameters(
    payload: Partial<SendFlowParameters> & Pick<SendFlowParameters, 'type'>
): void {
    sendFlowParameters.update((state) => {
        if (
            (payload.type === SendFlowType.BaseCoinTransfer && state?.type === SendFlowType.BaseCoinTransfer) ||
            (payload.type === SendFlowType.TokenTransfer && state?.type === SendFlowType.TokenTransfer) ||
            (payload.type === SendFlowType.NftTransfer && state?.type === SendFlowType.NftTransfer)
        ) {
            state = { ...state, ...payload }
        }
        return state
    })
}

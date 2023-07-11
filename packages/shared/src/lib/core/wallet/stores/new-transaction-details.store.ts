import { writable, Writable } from 'svelte/store'
import type { NewTransactionData } from '../types'

export enum NewTransactionType {
    TokenTransfer = 'TokenTransfer',
    NftTransfer = 'NftTransfer',
}

export const newTransactionData: Writable<NewTransactionData | undefined> = writable(undefined)

export function resetNewTokenTransactionData(): void {
    newTransactionData.set({
        type: NewTransactionType.TokenTransfer,
        recipient: undefined,
        rawAmount: undefined,
        asset: undefined,
        unit: undefined,
    })
}

export function resetNewTransactionData(): void {
    newTransactionData.set(undefined)
}

export function updateNewTransactionData(
    payload: Partial<NewTransactionData> & Pick<NewTransactionData, 'type'>
): void {
    newTransactionData.update((state) => {
        if (payload.type === NewTransactionType.TokenTransfer && state.type === NewTransactionType.TokenTransfer) {
            state = { ...state, ...payload }
        } else if (payload.type === NewTransactionType.NftTransfer && state.type === NewTransactionType.NftTransfer) {
            state = { ...state, ...payload }
        }
        return state
    })
}

export function setNewTransactionData(payload: NewTransactionData): void {
    newTransactionData.set(payload)
}

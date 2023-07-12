import { writable, Writable } from 'svelte/store'
import type { TransactionData } from '../types'

export enum NewTransactionType {
    TokenTransfer = 'TokenTransfer',
    NftTransfer = 'NftTransfer',
}

export const newTransactionData: Writable<TransactionData | undefined> = writable(undefined)

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

export function updateNewTransactionData(payload: Partial<TransactionData> & Pick<TransactionData, 'type'>): void {
    newTransactionData.update((state) => {
        if (payload.type === NewTransactionType.TokenTransfer && state.type === NewTransactionType.TokenTransfer) {
            state = { ...state, ...payload }
        } else if (payload.type === NewTransactionType.NftTransfer && state.type === NewTransactionType.NftTransfer) {
            state = { ...state, ...payload }
        }
        return state
    })
}

export function setNewTransactionData(payload: TransactionData): void {
    newTransactionData.set(payload)
}

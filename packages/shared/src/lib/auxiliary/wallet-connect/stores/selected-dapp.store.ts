import { Writable, writable } from 'svelte/store'
import { IConnectedDapp } from '../interface/connected-dapp.interface'

export const selectedDapp: Writable<IConnectedDapp | undefined> = writable(undefined)

export function setSelectedDapp(dapp: IConnectedDapp): void {
    selectedDapp.set(dapp)
}

export function clearSelectedDapp(): void {
    selectedDapp.set(undefined)
}

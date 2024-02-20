import { writable } from 'svelte/store'
import { IProfileAuthPopupState } from '../interfaces/profile-auth-popup-state.interface'

export const profileAuthPopup = writable<IProfileAuthPopupState>({
    active: false,
    id: undefined,
    props: undefined,
})

export function updateProfileAuthProps(payload: Partial<IProfileAuthPopupState>): void {
    profileAuthPopup?.update((state) => ({ ...state, ...payload }))
}

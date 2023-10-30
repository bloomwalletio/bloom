import { getActiveProfile } from '@core/profile/stores'
import { modifyPopupState } from '../helpers'
import { IPopupState } from '../interfaces'
import { get } from 'svelte/store'

export function openPopup(
    {
        id,
        props = null,
        hideClose = false,
        preventClose = false,
        transition = undefined,
        overflow = false,
        relative = true,
    }: Omit<IPopupState, 'active'>,
    forceClose: boolean = false,
    requiresLogin = true
): void {
    if (requiresLogin) {
        if (!get(getActiveProfile().loggedIn)) {
            return
        }
    }
    modifyPopupState({ active: true, id, hideClose, preventClose, transition, props, overflow, relative }, forceClose)
}

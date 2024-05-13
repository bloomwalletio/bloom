import { isLoggedIn } from '@core/profile/stores'
import { IPopupState } from '../interfaces'
import { modifyPopupState } from './modifyPopupState'

export function openPopup(
    {
        id,
        props = undefined,
        hideClose = false,
        preventClose = false,
        transition = undefined,
        overflow = false,
        autofocusContent = true,
        confirmClickOutside = false,
        relative = true,
    }: Omit<IPopupState, 'active'>,
    forceClose: boolean = false,
    requiresLogin = true
): void {
    if (requiresLogin) {
        if (!isLoggedIn()) {
            return
        }
    }
    modifyPopupState(
        {
            active: true,
            id,
            hideClose,
            preventClose,
            confirmClickOutside,
            transition,
            props,
            autofocusContent,
            overflow,
            relative,
        },
        forceClose
    )
}

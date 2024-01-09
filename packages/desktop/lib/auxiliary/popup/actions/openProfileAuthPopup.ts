import { IPopupState } from '../interfaces'
import { updateProfileAuthProps } from '../stores/profile-auth-popup.store'

export function openProfileAuthPopup({
    id,
    props = null,
    hideClose = false,
    preventClose = false,
}: Omit<IPopupState, 'active'>): void {
    updateProfileAuthProps({ active: true, id, hideClose, preventClose, props })
}

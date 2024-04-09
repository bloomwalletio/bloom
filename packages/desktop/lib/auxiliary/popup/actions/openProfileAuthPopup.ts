import { IProfileAuthPopupState } from '../interfaces'
import { updateProfileAuthProps } from '../stores/profile-auth-popup.store'

export function openProfileAuthPopup({
    id,
    props = undefined,
    hideClose = false,
    preventClose = false,
}: Omit<IProfileAuthPopupState, 'active'>): void {
    updateProfileAuthProps({ active: true, id, hideClose, preventClose, props })
}

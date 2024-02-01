import { updateProfileAuthProps } from '../stores/profile-auth-popup.store'

export function lockProfileAuthPopup(): void {
    updateProfileAuthProps({ preventClose: true })
}

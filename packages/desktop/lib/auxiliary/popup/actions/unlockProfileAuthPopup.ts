import { updateProfileAuthProps } from '../stores/profile-auth-popup.store'

export function unlockProfileAuthPopup(): void {
    updateProfileAuthProps({ preventClose: false })
}

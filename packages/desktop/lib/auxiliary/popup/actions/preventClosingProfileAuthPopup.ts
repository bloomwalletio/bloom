import { updateProfileAuthProps } from '../stores/profile-auth-popup.store'

export function preventClosingProfileAuthPopup(): void {
    updateProfileAuthProps({ preventClose: true })
}

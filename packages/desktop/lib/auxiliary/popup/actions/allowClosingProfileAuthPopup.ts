import { updateProfileAuthProps } from '../stores/profile-auth-popup.store'

export function allowClosingProfileAuthPopup(): void {
    updateProfileAuthProps({ preventClose: false })
}

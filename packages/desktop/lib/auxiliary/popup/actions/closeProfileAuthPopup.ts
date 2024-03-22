import { get } from 'svelte/store'
import { profileAuthPopup, updateProfileAuthProps } from '../stores'
import { localize } from '@core/i18n'

export function closeProfileAuthPopup(options?: { forceClose?: boolean; callOnCancel?: boolean }): void {
    const props = get(profileAuthPopup).props
    if (options?.callOnCancel && 'function' === typeof props?.onCancel) {
        props.onCancel(localize('error.profile.authenticationInterrupted'))
    }

    updateProfileAuthProps({
        active: false,
        id: undefined,
        hideClose: false,
        preventClose: false,
        props: undefined,
    })
}

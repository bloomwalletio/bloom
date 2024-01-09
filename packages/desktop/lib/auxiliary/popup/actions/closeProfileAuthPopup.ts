import { get } from 'svelte/store'
import { popupState, updateProfileAuthProps } from '../stores'

export function closeProfileAuthPopup(options?: { forceClose?: boolean; callOnCancel?: boolean }): void {
    const props = get(popupState).props
    if (options?.callOnCancel && 'function' === typeof props?.onCancel) {
        props.onCancel()
    }

    updateProfileAuthProps({
        active: false,
        id: null,
        hideClose: false,
        preventClose: false,
        props: null,
    })
}

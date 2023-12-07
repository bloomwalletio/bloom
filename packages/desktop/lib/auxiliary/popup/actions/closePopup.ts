import { get } from 'svelte/store'
import { modifyPopupState } from '../helpers'
import { popupState } from '../stores'

export function closePopup(options?: { forceClose?: boolean; callOnCancel?: boolean }): void {
    const props = get(popupState).props
    if (options?.callOnCancel && 'function' === typeof props?.onCancel) {
        props.onCancel()
    }

    modifyPopupState(
        {
            active: false,
            id: null,
            hideClose: false,
            preventClose: false,
            props: null,
            overflow: false,
            relative: false,
        },
        options?.forceClose
    )
}

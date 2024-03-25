import { get } from 'svelte/store'
import { popupState } from '../stores'
import { modifyPopupState } from './modifyPopupState'

export function closePopup(options?: { forceClose?: boolean; callOnCancel?: boolean }): void {
    const props = get(popupState).props
    if (options?.callOnCancel && 'function' === typeof props?.onCancel) {
        props.onCancel()
    }

    modifyPopupState(
        {
            active: false,
            id: undefined,
            hideClose: false,
            preventClose: false,
            props: undefined,
            overflow: false,
            relative: false,
        },
        options?.forceClose
    )
}

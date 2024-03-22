import { PopupId } from '../enums'
import { IPopupState } from '../interfaces'

export const DEFAULT_POPUP_STATE: IPopupState = {
    active: false,
    id: PopupId.Confirmation,
    hideClose: false,
    preventClose: false,
    transition: undefined,
    props: undefined,
    overflow: false,
    relative: true,
}

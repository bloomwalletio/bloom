import { PopupId } from '../enums'

export interface IProfileAuthPopupState {
    active: boolean
    id: PopupId | undefined
    props?: unknown
    hideClose?: boolean
    preventClose?: boolean
}

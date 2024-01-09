import { ProfileAuthPopupId } from '../enums'

export interface IProfileAuthPopupState {
    active: boolean
    id: ProfileAuthPopupId | undefined
    props?: Record<string, unknown>
    hideClose?: boolean
    preventClose?: boolean
}

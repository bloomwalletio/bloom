import { IContact } from '@core/contact'

export interface IContactSubject {
    type: 'contact'
    address: string
    contact: IContact
}

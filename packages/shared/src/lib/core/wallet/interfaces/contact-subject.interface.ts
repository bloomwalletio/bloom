import { IContact } from '@core/contact'
import { SubjectType } from '../enums'

export interface IContactSubject {
    type: SubjectType.Contact
    address: string
    contact: IContact
}

import { SubjectType } from '@core/wallet'
import { IContactMetadata } from './contact-metadata.interface'

export interface IContactSubject {
    type: SubjectType.Contact
    contact: IContactMetadata
    address: string
}

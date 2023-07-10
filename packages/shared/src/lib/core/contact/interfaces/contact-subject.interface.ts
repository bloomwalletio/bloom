import { IContactMetadata } from './contact-metadata.interface'

export interface IContactSubject {
    type: 'contact'
    contact: IContactMetadata
    address: string
}

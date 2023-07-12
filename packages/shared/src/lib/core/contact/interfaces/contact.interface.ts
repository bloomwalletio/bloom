import { IContactMetadata } from './'

export interface IContact extends IContactMetadata {
    addresses: string[]
}

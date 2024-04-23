import { SubjectType } from '../enums'

export interface ISmartContractSubject {
    type: SubjectType.SmartContract
    address: string
    verified?: boolean
    name?: string
}

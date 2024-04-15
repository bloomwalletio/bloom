import { SubjectType } from '../enums'

export interface ISmartContractSubject {
    type: SubjectType.SmartContract
    name: string
    address: string
    verified: boolean
}

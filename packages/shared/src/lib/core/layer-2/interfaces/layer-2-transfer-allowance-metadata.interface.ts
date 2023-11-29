import { ILayer2SmartContractCallData } from './layer-2-smart-contract-call-data.interface'

export interface ILayer2TransferAllowanceMetadata extends ILayer2SmartContractCallData {
    ethereumAddress: string
}

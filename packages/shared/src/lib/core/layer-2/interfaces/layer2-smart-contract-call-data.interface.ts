import { ILayer2AssetAllowance } from './asset-allowance.interface'

export interface ILayer2SmartContractCallData extends ILayer2AssetAllowance {
    senderContract: string
    targetContract: string
    contractFunction: string
    gasLimit: string
}

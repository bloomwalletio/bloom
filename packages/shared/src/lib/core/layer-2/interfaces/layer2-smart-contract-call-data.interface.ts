import { IAssetAllowance } from './asset-allowance.interface'

export interface ILayer2SmartContractCallData extends IAssetAllowance {
    senderContract: string
    targetContract: string
    contractFunction: string
    gasBudget: string
}

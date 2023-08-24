import { IAssetAllowance } from './asset-allowance.interface'
import { ILayer2SendMetadataParameterParameters } from './layer-2-send-metadata-parameter-parameters.interface'

export interface ILayer2SendMetadataParameter {
    targetContract: number
    entrypoint: number
    params: ILayer2SendMetadataParameterParameters
    allowance: IAssetAllowance
    gasBudget: number
}

import { IAssetAllowance } from './asset-allowance.interface'
import { IUnwrapAssetSendMetadataParameters } from './unwrap-asset-send-metadata-parameters.interface'

export interface IUnwrapAssetSendMetadata {
    targetContract: number
    entrypoint: number
    params: IUnwrapAssetSendMetadataParameters
    allowance: IAssetAllowance
    gasBudget: number
}

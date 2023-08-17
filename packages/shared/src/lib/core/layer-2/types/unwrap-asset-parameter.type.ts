import {
    IAssetAllowance,
    IUnwrapAssetSendMetadata,
    IUnwrapAssetSendOptions,
    IUnwrapAssetTargetAddress,
} from '../interfaces'

export type UnwrapAssetParameter =
    | IUnwrapAssetTargetAddress
    | IAssetAllowance
    | boolean
    | IUnwrapAssetSendMetadata
    | IUnwrapAssetSendOptions

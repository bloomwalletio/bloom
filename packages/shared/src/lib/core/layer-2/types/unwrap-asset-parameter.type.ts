import {
    IAssetAllowance,
    ILayer2SendMetadataParameter,
    ILayer2SendOptionsParameter,
    ILayer2TargetAddressParameter,
} from '../interfaces'

export type UnwrapAssetParameter =
    | ILayer2TargetAddressParameter
    | IAssetAllowance
    | boolean
    | ILayer2SendMetadataParameter
    | ILayer2SendOptionsParameter

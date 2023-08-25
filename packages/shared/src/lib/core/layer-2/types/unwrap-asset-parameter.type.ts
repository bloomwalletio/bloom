import {
    ILayer2AssetAllowance,
    ILayer2SendMetadataParameter,
    ILayer2SendOptionsParameter,
    ILayer2TargetAddressParameter,
} from '../interfaces'

export type UnwrapAssetParameter =
    | ILayer2TargetAddressParameter
    | ILayer2AssetAllowance
    | boolean
    | ILayer2SendMetadataParameter
    | ILayer2SendOptionsParameter

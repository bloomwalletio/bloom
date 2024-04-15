import { IBlockscoutTokenInfo, IBlockscoutTokenInfoDto } from './blockscout-token-info.interface'

// snake_case returned by the API
export interface IBlockscoutAssetDto extends IBlockscoutAssetCommon {
    token: IBlockscoutTokenInfoDto
}

export interface IBlockscoutAsset extends IBlockscoutAssetCommon {
    token: IBlockscoutTokenInfo
}

interface IBlockscoutAssetCommon {
    token_id: string
    token_instance: unknown
    value: string
}

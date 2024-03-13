import { IBlockscoutTokenInfo } from './blockscout-token-info.interface'

// snake_case returned by the API
export interface IBlockscoutAsset {
    token: IBlockscoutTokenInfo
    token_id: string
    token_instance: unknown
    value: string
}

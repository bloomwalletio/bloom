import { IUnwrapAssetSendOptionsExpiration } from './unwrap-asset-send-options-expiration.interface'

export interface IUnwrapAssetSendOptions {
    timelock: number
    expiration: IUnwrapAssetSendOptionsExpiration
}

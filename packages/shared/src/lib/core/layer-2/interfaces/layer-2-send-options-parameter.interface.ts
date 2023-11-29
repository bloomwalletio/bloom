import { ILayer2SendOptionsExpiration } from './layer-2-send-options-expiration.interface'

export interface ILayer2SendOptionsParameter {
    timelock: number
    expiration: ILayer2SendOptionsExpiration
}

import { ILayer2TargetAddressParameter } from './layer-2-target-address-parameter.interface'

export interface ILayer2SendOptionsExpiration {
    time: number
    returnAddress: ILayer2TargetAddressParameter
}

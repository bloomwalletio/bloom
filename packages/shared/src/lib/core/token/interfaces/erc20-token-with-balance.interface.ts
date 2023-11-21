import { IErc20Metadata } from './erc20-metadata.interface'

export interface IErc20TokenWithBalance extends IErc20Metadata {
    address: string
    value: bigint
}

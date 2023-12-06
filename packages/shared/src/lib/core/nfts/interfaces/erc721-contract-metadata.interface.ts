import { NftStandard } from '../enums'

export interface IErc721ContractMetadata {
    standard: NftStandard.Erc721
    address: string
    name: string
    symbol: string
}

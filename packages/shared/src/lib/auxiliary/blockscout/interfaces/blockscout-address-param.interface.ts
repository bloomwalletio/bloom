import { IAddressTag, IWatchlistName } from './blockscout-transaction.interface'

export interface IBlockscoutAddressParam {
    hash: string
    implementation_name: string
    name: string
    is_contract: boolean
    private_tags: IAddressTag[]
    watchlist_names: IWatchlistName[]
    public_tags: IAddressTag[]
    is_verified: boolean
}

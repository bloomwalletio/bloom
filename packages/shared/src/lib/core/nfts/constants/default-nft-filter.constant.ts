import { INftFilter } from '../interfaces/nft-filter.interface'

export const DEFAULT_NFT_FILTER: INftFilter = {
    network: {
        active: false,
        type: 'network',
        localeKey: 'filters.network',
        selected: '',
    },
}

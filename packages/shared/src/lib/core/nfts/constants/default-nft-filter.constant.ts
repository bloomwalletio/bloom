import { INftFilter } from '../interfaces'

export const DEFAULT_NFT_FILTER: INftFilter = {
    network: {
        active: false,
        type: 'network',
        localeKey: 'filters.network',
        selected: '',
    },
}

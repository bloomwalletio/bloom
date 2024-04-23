import { BooleanFilterOption } from '@core/utils/enums/filters'
import { INftFilter } from '../interfaces'

export const DEFAULT_NFT_FILTER: INftFilter = {
    network: {
        active: false,
        type: 'network',
        localeKey: 'filters.network',
        selected: '',
    },
    showHidden: {
        active: false,
        type: 'selection',
        localeKey: 'filters.showHidden',
        selected: BooleanFilterOption.Yes,
        choices: [BooleanFilterOption.Yes, BooleanFilterOption.No],
    },
}

import { Layer2AccountBalance } from '../types/layer-2-account-balance.type'

export interface ILayer2ProfileBalances {
    [accountIndex: number]: Layer2AccountBalance | undefined
}

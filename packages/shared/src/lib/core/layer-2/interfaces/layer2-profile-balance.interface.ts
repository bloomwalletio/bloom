import { Layer2AccountBalance } from '../types/layer2-account-balance.interface'

export interface ILayer2ProfileBalances {
    [accountIndex: number]: Layer2AccountBalance | undefined
}

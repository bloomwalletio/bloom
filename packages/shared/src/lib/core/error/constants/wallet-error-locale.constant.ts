import { WalletError } from '../enums'

export const WALLET_ERROR_LOCALE: { [key in WalletError]?: string } = {
    [WalletError.IncorrectPassword]: 'incorrectPassword',
}

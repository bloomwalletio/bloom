import { WalletError } from '../enums'

export const WALLET_ERROR_REGEX: { [key in WalletError]?: RegExp } = {
    [WalletError.AccountNotFound]: /^account\s[\d]*\snot\sfound/,
}

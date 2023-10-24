import { CWalletError } from '../../classes/wallet-error.class'
import { WALLET_ERROR_REGEX } from '../../constants'
import { WalletError } from '../../enums'

export function parseWalletError(message: string): CWalletError {
    switch (true) {
        case WALLET_ERROR_REGEX[WalletError.AccountNotFound]?.test(message):
            return new CWalletError(WalletError.AccountNotFound, message)
        default:
            return new CWalletError(WalletError.Unknown, message)
    }
}

import { BaseError } from '../classes'
import { CWalletError } from '../classes/wallet-error.class'

export type Error = CWalletError | BaseError

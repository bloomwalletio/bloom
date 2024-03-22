import { IAccount, UnableToGetBoundAccountError } from '@core/account'
import { IError } from '@core/error'
import { profileManager as _profileManager, createAccount, getAccount } from '@core/profile-manager'

export async function getBoundAccount(
    accountIndex: number,
    createAccountsIfNotFound: boolean = false,
    profileManager = _profileManager
): Promise<IAccount> {
    try {
        /**
         * CAUTION: Do NOT remove the `await` keyword here.
         * It is needed in the case of handling an AccountNotFound
         * error by creating more accounts.
         */
        const account = await getAccount(accountIndex ?? 0, profileManager)
        return account
    } catch (err) {
        // TODO: improve error handling for iota-sdk errors after their changes
        const { type, error } = err as IError
        if (type === 'wallet' && /^account\s[\d]*\snot\sfound/gm.test(error ?? '') && createAccountsIfNotFound) {
            for (let indexToCreateAccount = 0; indexToCreateAccount < accountIndex; indexToCreateAccount++) {
                const account = await createAccount({}, profileManager)
                if (account?.getMetadata()?.index === accountIndex) {
                    return account
                }
            }
            throw new UnableToGetBoundAccountError()
        } else {
            throw err
        }
    }
}

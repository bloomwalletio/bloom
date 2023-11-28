import { IAccountState } from '@core/account'
import { getSelectedAccountIndex } from '@core/account/stores'
import { IChain } from '@core/network'
import { findActiveAccountWithAddress } from '@core/profile/actions'
import { openPopup, PopupId } from '../../../../../../desktop/lib/auxiliary/popup'

export function switchToRequiredAccount(accountAddress: string, chain: IChain): Promise<IAccountState> {
    return new Promise((resolve, reject) => {
        const account = findActiveAccountWithAddress(accountAddress, chain.getConfiguration().id)
        if (!account) {
            reject('UNSUPPORTED_ACCOUNTS')
            return
        }

        if (account.index === getSelectedAccountIndex()) {
            resolve(account)
        } else {
            openPopup({
                id: PopupId.DappAccountSwitcher,
                props: {
                    account,
                    onCancel: () => reject('USER_REJECTED'),
                    onConfirm: () => resolve(account),
                },
            })
        }
    })
}

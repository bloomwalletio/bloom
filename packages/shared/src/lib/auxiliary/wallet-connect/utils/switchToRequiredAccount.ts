import { IAccountState } from '@core/account'
import { getSelectedAccountIndex } from '@core/account/stores'
import { Network } from '@core/network'
import { findActiveAccountWithAddress } from '@core/profile/actions'
import { openPopup, PopupId } from '../../../../../../desktop/lib/auxiliary/popup'

export function switchToRequiredAccount(accountAddress: string, network: Network): Promise<IAccountState> {
    return new Promise((resolve, reject) => {
        const account = findActiveAccountWithAddress(accountAddress, network.id)
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

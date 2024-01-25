import { IAccountState } from '@core/account'
import { isActiveLedgerProfile, isSoftwareProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import { closePopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { signHashedMessageWithStronghold, signMessageWithStronghold } from '@core/stronghold/utils'
import { Ledger } from '@core/ledger/classes'

export async function signMessage(
    message: string,
    isHashedMessage: boolean,
    coinType: number,
    account: IAccountState
): Promise<string | undefined> {
    const bip44Path = {
        coinType,
        account: 0,
        change: 0,
        addressIndex: 0,
    }
    const { index } = account
    let signedMessage: string | undefined
    if (get(isSoftwareProfile)) {
        // Follow MetaMask's convention around incrementing address indices instead of account indices
        bip44Path.addressIndex = index
        if (isHashedMessage) {
            signedMessage = await signHashedMessageWithStronghold(message, bip44Path)
        } else {
            signedMessage = await signMessageWithStronghold(message, bip44Path)
        }
    } else if (get(isActiveLedgerProfile)) {
        bip44Path.account = index
        if (isHashedMessage) {
            signedMessage = await Ledger.signHashedMessage(message, bip44Path)
        } else {
            signedMessage = await Ledger.signMessage(message, bip44Path)
        }
    }

    if (!signedMessage) {
        if (get(isActiveLedgerProfile)) {
            closePopup({ forceClose: true })
        }
        throw new Error('No signature provided')
    }

    return signedMessage
}

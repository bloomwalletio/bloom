import { IAccountState } from '@core/account'
import { isActiveLedgerProfile, isSoftwareProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import { closePopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { signMessageWithStronghold } from '@core/stronghold/utils'
import { Ledger } from '@core/ledger/classes'
import { Converter } from '@core/utils'

export async function signMessage(
    message: string,
    coinType: number,
    method: 'eth_sign' | 'personal_sign',
    account: IAccountState
): Promise<string | undefined> {
    const bip44Path = {
        coinType,
        account: account.index,
        change: 0,
        addressIndex: 0,
    }
    const prefix = method === 'personal_sign' ? '\x19Ethereum Signed Message:\n' + message.length : ''
    const hexMessage = Converter.utf8ToHex(prefix + message)

    let signedMessage: string | undefined
    if (get(isSoftwareProfile)) {
        signedMessage = await signMessageWithStronghold(hexMessage, bip44Path)
    } else if (get(isActiveLedgerProfile)) {
        signedMessage = await Ledger.signMessage(message, hexMessage, bip44Path)
    }

    if (!signedMessage) {
        if (get(isActiveLedgerProfile)) {
            closePopup(true)
        }
        throw new Error('No signature provided')
    }

    return signedMessage
}

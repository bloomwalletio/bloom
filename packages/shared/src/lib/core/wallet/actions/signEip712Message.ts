import { IAccountState } from '@core/account'
import { isActiveLedgerProfile, isSoftwareProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import { closePopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { signMessageWithStronghold } from '@core/stronghold/utils'
import { Ledger } from '@core/ledger/classes'

export async function signEip712Message(
    jsonString: string,
    version: 'V1' | 'V2' | 'V3' | 'V4',
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
        signedMessage = await signMessageWithStronghold(jsonString, bip44Path)
    } else if (get(isActiveLedgerProfile)) {
        bip44Path.account = index
        signedMessage = await Ledger.signEip712Message(jsonString, bip44Path, version)
    }

    if (!signedMessage) {
        if (get(isActiveLedgerProfile)) {
            closePopup({ forceClose: true })
        }
        throw new Error('No signature provided')
    }

    return signedMessage
}

import { IAccountState } from '@core/account'
import { isActiveLedgerProfile, isSoftwareProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import { closePopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { signMessageWithStronghold } from '@core/stronghold/utils'

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
    let signedMessage: string | undefined
    if (get(isSoftwareProfile)) {
        signedMessage = await signMessageWithStronghold(message, method, bip44Path)
        // } else if (get(isActiveLedgerProfile)) {
        //     signedMessage = await Ledger.signEvmTransaction(txData, chainId, bip44Path)
    }

    if (!signedMessage) {
        if (get(isActiveLedgerProfile)) {
            closePopup(true)
        }
        throw new Error('No signature provided')
    }

    return signedMessage
}

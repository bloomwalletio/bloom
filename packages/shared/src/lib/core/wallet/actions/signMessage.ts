import { IAccountState } from '@core/account'
import { updateSelectedAccount } from '@core/account/stores'
import { handleError } from '@core/error/handlers'
import { EvmChainId } from '@core/network/enums'
import { isActiveLedgerProfile, isSoftwareProfile } from '@core/profile/stores'
import { get } from 'svelte/store'
import { closePopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { signMessageWithStronghold } from '@core/stronghold/utils'

export async function signMessage(
    message: string,
    chainId: EvmChainId,
    coinType: number,
    account: IAccountState
): Promise<string | undefined> {
    try {
        updateSelectedAccount({ isTransferring: true })

        const bip44Path = {
            coinType,
            account: account.index,
            change: 0,
            addressIndex: 0,
        }
        let signedMessage: string | undefined
        if (get(isSoftwareProfile)) {
            signedMessage = await signMessageWithStronghold(message, 'eth_sign', bip44Path, account)
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
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}

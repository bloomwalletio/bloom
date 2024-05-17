import { updateSelectedAccount } from '@core/account/stores'
import { closePopup } from '../../../../../../desktop/lib/auxiliary/popup'
import { IEvmNetwork } from '@core/network'
import { getIsActiveLedgerProfile } from '@core/profile/stores'
import { TransactionReceipt } from 'web3'

export async function sendSignedEvmTransaction(
    evmNetwork: IEvmNetwork,
    signedTransaction: string
): Promise<TransactionReceipt | undefined> {
    try {
        updateSelectedAccount({ isTransferring: true })
        return await evmNetwork.provider.eth.sendSignedTransaction(signedTransaction)
    } catch (err) {
        if (getIsActiveLedgerProfile()) {
            closePopup({ forceClose: true })
        }
        throw err
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
